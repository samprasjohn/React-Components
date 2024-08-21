import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Modal.css'; // Custom styles for the modal

const Modal = ({ isVisible, onClose, children, size, position, backdrop, closeOnEsc }) => {
  const modalRef = useRef(null);

  // Handle close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOnEsc, onClose]);

  // Focus management
  useEffect(() => {
    if (isVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="modal-backdrop" style={{ backgroundColor: backdrop }}>
      <div
        className={`modal-content ${size}`}
        style={{ top: position.top, left: position.left, transform: `translate(-${position.left}, -${position.top})` }}
        tabIndex="-1"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
      >
        <button className="modal-close-button" onClick={onClose} aria-label="Close Modal">
          &times;
        </button>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  position: PropTypes.shape({
    top: PropTypes.string,
    left: PropTypes.string,
  }),
  backdrop: PropTypes.string,
  closeOnEsc: PropTypes.bool,
};

Modal.defaultProps = {
  size: 'medium',
  position: { top: '50%', left: '50%' },
  backdrop: 'rgba(0, 0, 0, 0.5)',
  closeOnEsc: true,
};

export default Modal;

//EXAMPLE///////////////////////////////////////////////////////
import React, { useState } from 'react';
import Modal from './Modal';

const ConfirmationDialog = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpen = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleConfirm = () => {
    console.log("Action confirmed!");
    setModalVisible(false);
  };

  return (
    <div>
      <button onClick={handleOpen}>Open Confirmation Dialog</button>
      <Modal isVisible={isModalVisible} onClose={handleClose} size="small">
        <h2>Are you sure?</h2>
        <p>This action cannot be undone.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={handleClose}>Cancel</button>
          <button onClick={handleConfirm} style={{ backgroundColor: 'red', color: 'white' }}>Confirm</button>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmationDialog;
import React, { useState } from 'react';
import Modal from './Modal';

const FormSubmissionModal = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleOpen = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setModalVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div>
      <button onClick={handleOpen}>Open Form Modal</button>
      <Modal isVisible={isModalVisible} onClose={handleClose} size="medium">
        <h2>Submit Your Information</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <button type="submit">Submit</button>
        </form>
      </Modal>
    </div>
  );
};

export default FormSubmissionModal;
