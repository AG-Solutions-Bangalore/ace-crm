export const checkPermission = (userId, button, permissions) => {
  if (!permissions || !Array.isArray(permissions)) return false;
  const permission = permissions.find(p => p.button === button);
  if (!permission) return false;
  
  let userIds = [];
  if (Array.isArray(permission.userIds)) {
    userIds = permission.userIds;
  } else if (typeof permission.userIds === 'string') {
    userIds = permission.userIds.split(',').map(id => id.trim());
  } else if (permission.userIds) {
    userIds = [permission.userIds];
  }
  
  const stringUserIds = userIds.map(id => String(id));
  return stringUserIds.includes(String(userId)) && permission.status === 'Active';
};