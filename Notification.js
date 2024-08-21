import React, { useState, useEffect, useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import './Notification.css';

// Create a Notification Context
const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto-dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      {message}
      <button className="close-button" onClick={onClose}>×</button>
    </div>
  );
};

Notification.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message) => {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), type, message }
    ]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map(({ id, type, message }) => (
          <Notification
            key={id}
            type={type}
            message={message}
            onClose={() => removeNotification(id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationProvider;

//EXAMPLE////////////////////////////////////////////////////////////////////
import React from 'react';
import ReactDOM from 'react-dom';
import NotificationProvider, { useNotifications } from './Notification';
import './styles.css';

const App = () => {
  const { addNotification } = useNotifications();

  const handleShowNotification = (type) => {
    addNotification(type, `This is a ${type} message!`);
  };

  return (
    <div className="app">
      <h1>Notification System</h1>
      <button onClick={() => handleShowNotification('success')}>Show Success</button>
      <button onClick={() => handleShowNotification('error')}>Show Error</button>
      <button onClick={() => handleShowNotification('info')}>Show Info</button>
      <button onClick={() => handleShowNotification('warning')}>Show Warning</button>
    </div>
  );
};

ReactDOM.render(
  <NotificationProvider>
    <App />
  </NotificationProvider>,
  document.getElementById('root')
);
