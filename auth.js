export const hasAccess = (user, require => {
    const levels = ["free", "gold", "platinum", "diamond"];
    return levels.indexOf(user.membership >= levels.indexOf(requiredLevel))
});