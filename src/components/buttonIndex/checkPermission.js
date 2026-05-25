export const checkPermission = (userId, button, permissions) => {
  if (!permissions || !Array.isArray(permissions)) return false;
  const permission = permissions.find(p => p.button === button);
  if (!permission) return false;
  
  const userIds = Array.isArray(permission.userIds) ? permission.userIds : [];
  const stringUserIds = userIds.map(id => String(id));
  return stringUserIds.includes(String(userId)) && permission.status === 'Active';
};