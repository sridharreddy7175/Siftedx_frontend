export default class ValidationErrorMsgs {
    static SKILL_PARTIAL_MATCH = 'Skill matched partially. Please choose from the lists';
    static SKILL_DUPLICATE_SAME_CATEGORY = 'Duplicate skill. Please delete';
    static SKILL_DUPLICATE_DIFFERENT_CATEGORY = 'Same skill added in multiple categories. Please add it only under one category';
    static SKILL_UNRECOGNIZED = 'Unrecognized Skill';
    static SKILL_RECOGNIZED = 'Recognized Skill';
    static SKILL_NOT_ADDED = 'Please click the + button to add your skills';
    static AVAILABILITY_EXIST = 'This slot is already added or covered by one of the existing slots for this particular date';
    static AVAILABILITY_EXIST_IN_RECURRING = 'This slot is already covered in the recurring availability schedule';
    static PASSWORD_REQUIRED = 'Please enter your password';
    static PASSWORD_INVALID = 'Password is wrong';
    static PASSWORD_OTP_REQUIRED = 'Please enter OTP';
    static PASSWORD_OTP_INVALID = 'OTP is invalid';
    static TIMESLOT_MINIMUM = 'Minimum slot should be 1hour';
    static TIMESLOT_ALREADY_EXISTS = 'Time period already selected';
    static TIMESLOT_PAST_TIME = 'Slot should start atleast 1hr from now';
}