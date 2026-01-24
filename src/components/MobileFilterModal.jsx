import "./MobileFilterModal.css";

const MobileFilterModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="mb-filter-backdrop" onClick={onClose}>
      <div
        className="mb-filter-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="mb-filter-header">
          <button className="back-btn" onClick={onClose}>←</button>
          <h3>Filters</h3>
          <button className="reset-btn">Reset</button>
        </div>

        {/* TABS */}
        <div className="mb-filter-tabs">
          <button className="active">Buy</button>
          <button>Rent</button>
          <button>New Projects</button>
          <button>Plot</button>
          <button>Commercial</button>
        </div>

        {/* BODY */}
        <div className="mb-filter-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileFilterModal;
