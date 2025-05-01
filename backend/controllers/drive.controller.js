const VaccinationDrive = require('../models/vaccination-drive.model');
const Student = require('../models/student.model');

// Get all vaccination drives with optional filters
exports.getAllDrives = async (req, res) => {
  try {
    const { status, upcoming, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    if (status) query.status = status;

    // Handle upcoming filter (drives within next 30 days)
    if (upcoming === 'true') {
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(today.getDate() + 30);

      query.date = {
        $gte: today,
        $lte: thirtyDaysLater,
      };
      query.status = 'Scheduled';
    }

    // Count total documents for pagination
    const total = await VaccinationDrive.countDocuments(query);

    // Get paginated drives
    const drives = await VaccinationDrive.find(query)
      .skip((page - 1) * limit)
      .limit(Number.parseInt(limit))
      .sort({ date: 1 })
      .populate('createdBy', 'username');

    res.json({
      drives,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page), // Ensure currentPage is a number
      total,
    });
  } catch (error) {
    console.error('Error fetching vaccination drives:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get vaccination drive by ID
exports.getDriveById = async (req, res) => {
  try {
    const drive = await VaccinationDrive.findById(req.params.id).populate('createdBy', 'username');

    if (!drive) {
      return res.status(404).json({ message: 'Vaccination drive not found' });
    }

    res.json(drive);
  } catch (error) {
    console.error('Error fetching vaccination drive:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new vaccination drive
exports.createDrive = async (req, res) => {
  try {
    const { vaccineName, date, availableDoses, applicableClasses } = req.body;

    // Validate date (must be at least 15 days in advance)
    const driveDate = new Date(date);
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 15);

    if (driveDate < minDate) {
      return res.status(400).json({
        message: 'Vaccination drive must be scheduled at least 15 days in advance',
      });
    }

    // Check for overlapping drives on the same date
    const overlappingDrive = await VaccinationDrive.findOne({
      date: {
        $gte: new Date(driveDate.setHours(0, 0, 0, 0)),
        $lt: new Date(driveDate.setHours(23, 59, 59, 999)),
      },
      status: 'Scheduled',
    });

    if (overlappingDrive) {
      return res.status(400).json({
        message: 'Another vaccination drive is already scheduled for this date',
      });
    }

    // Create new vaccination drive
    const drive = new VaccinationDrive({
      vaccineName,
      date: driveDate,
      availableDoses,
      applicableClasses,
      createdBy: req.user._id, // Assuming req.user is populated by authentication middleware
    });

    await drive.save();

    res.status(201).json(drive);
  } catch (error) {
    console.error('Error creating vaccination drive:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update vaccination drive
exports.updateDrive = async (req, res) => {
  try {
    const { vaccineName, date, availableDoses, applicableClasses } = req.body;

    // Check if drive exists
    const drive = await VaccinationDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Vaccination drive not found' });
    }

    // Check if drive is already completed or cancelled
    if (drive.status !== 'Scheduled') {
      return res.status(400).json({
        message: `Cannot update a ${drive.status.toLowerCase()} vaccination drive`,
      });
    }

    // Check if drive date is in the past
    if (new Date(drive.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot update a past vaccination drive' });
    }

    // Validate new date (must be at least 15 days in advance)
    if (date) {
      const driveDate = new Date(date);
      const today = new Date();
      const minDate = new Date();
      minDate.setDate(today.getDate() + 15);

      if (driveDate < minDate) {
        return res.status(400).json({
          message: 'Vaccination drive must be scheduled at least 15 days in advance',
        });
      }

      // Check for overlapping drives on the same date (excluding this drive)
      const overlappingDrive = await VaccinationDrive.findOne({
        _id: { $ne: req.params.id },
        date: {
          $gte: new Date(driveDate.setHours(0, 0, 0, 0)),
          $lt: new Date(driveDate.setHours(23, 59, 59, 999)),
        },
        status: 'Scheduled',
      });

      if (overlappingDrive) {
        return res.status(400).json({
          message: 'Another vaccination drive is already scheduled for this date',
        });
      }

      drive.date = driveDate;
    }

    // Update drive
    if (vaccineName) drive.vaccineName = vaccineName;
    if (availableDoses) drive.availableDoses = availableDoses;
    if (applicableClasses) drive.applicableClasses = applicableClasses;

    await drive.save();

    res.json(drive);
  } catch (error) {
    console.error('Error updating vaccination drive:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel vaccination drive
exports.cancelDrive = async (req, res) => {
  try {
    // Check if drive exists
    const drive = await VaccinationDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Vaccination drive not found' });
    }

    // Check if drive is already completed or cancelled
    if (drive.status !== 'Scheduled') {
      return res.status(400).json({
        message: `Cannot cancel a ${drive.status.toLowerCase()} vaccination drive`,
      });
    }

    // Cancel drive
    drive.status = 'Cancelled';
    await drive.save();

    // Update all scheduled vaccinations for this drive to 'Missed'
    await Student.updateMany(
      { 'vaccinationStatus.driveId': drive._id }, // Corrected: Use 'vaccinationStatus.driveId'
      { $set: { 'vaccinationStatus.$[elem].status': 'Missed' } },
      { arrayFilters: [{ 'elem.driveId': drive._id, 'elem.status': 'Scheduled' }] } // More specific filter
    );

    res.json({
      message: 'Vaccination drive cancelled successfully',
      drive,
    });
  } catch (error) {
    console.error('Error cancelling vaccination drive:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark vaccination drive as completed
exports.completeDrive = async (req, res) => {
  try {
    // Check if drive exists
    const drive = await VaccinationDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Vaccination drive not found' });
    }

    // Check if drive is already completed or cancelled
    if (drive.status !== 'Scheduled') {
      return res.status(400).json({
        message: `Cannot complete a ${drive.status.toLowerCase()} vaccination drive`,
      });
    }

    // Complete drive
    drive.status = 'Completed';
    await drive.save();

    // Optionally, update student vaccination statuses for this drive.
    // You might want to handle this based on the actual vaccination records.
    // For example, you might iterate through students who were marked as vaccinated
    // during this drive and update their status accordingly.
    // The following is a placeholder and might need adjustment based on your logic:
    // await Student.updateMany(
    //   { 'vaccinationStatus.driveId': drive._id, 'vaccinationStatus.status': 'Scheduled' },
    //   { $set: { 'vaccinationStatus.$.status': 'Completed' } }
    // );

    res.json({
      message: 'Vaccination drive marked as completed successfully',
      drive,
    });
  } catch (error) {
    console.error('Error completing vaccination drive:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get students for a specific drive
exports.getDriveStudents = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Check if drive exists
    const drive = await VaccinationDrive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Vaccination drive not found' });
    }

    // Build query
    const query = {
      'vaccinationStatus.driveId': req.params.id,
    };

    if (status) {
      query['vaccinationStatus.vaccineName'] = status; // Assuming 'status' refers to vaccine name
    }

    // Count total documents for pagination
    const total = await Student.countDocuments(query);

    // Get paginated students
    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(Number.parseInt(limit))
      .sort({ name: 1 });

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page), // Ensure currentPage is a number
      total,
    });
  } catch (error) {
    console.error('Error fetching students for drive:', error);
    res.status(500).json({ message: 'Server error' });
  }
};