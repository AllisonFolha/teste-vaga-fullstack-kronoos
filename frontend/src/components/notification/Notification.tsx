import React from 'react';
import './Notification.scss';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => <div className={`notification ${type}`}>{message}</div>;

export default Notification;
