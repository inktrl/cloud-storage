module.exports = class UserDto {
    email;
    id;
    username;
    isActivated;
    diskSpace;
    usedSpace;
    avatar;
    registrationDate;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.username = model.username;
        this.isActivated = model.isActivated;
        this.diskSpace = model.diskSpace;
        this.usedSpace = model.usedSpace;
        this.avatar = model.avatar;
        this.registrationDate = model.registrationDate;
    }
}