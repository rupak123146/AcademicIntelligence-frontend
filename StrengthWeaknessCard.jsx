import React from 'react';
import '../../assets/styles/analytics.css';

const StrengthWeaknessCard = ({ title, items, type = 'strength' }) => {
  const getColor = (type) => {
    return type === 'strength' ? '#10b981' : '#ef4444';
  };

  const getIcon = (type) => {
    return type === 'strength' ? '✓' : '⚠';
  };

  if (!items || items.length === 0) {
    return (
      <div className={`strength-weakness-card card-${type}`}>
        <h3>{title}</h3>
        <p className="empty-text">No data available yet</p>
      </div>
    );
  }

  return (
    <div className={`strength-weakness-card card-${type}`}>
      <h3>{title}</h3>
      <div className="items-list">
        {items.map((item, index) => (
          <div key={index} className="item">
            <span className="item-icon" style={{ color: getColor(type) }}>
              {getIcon(type)}
            </span>
            <div className="item-content">
              <p className="item-name">{item.name}</p>
              {item.percentage && (
                <div className="item-bar">
                  <div
                    className="item-progress"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: getColor(type)
                    }}
                  />
                </div>
              )}
              <p className="item-value">{item.percentage || item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrengthWeaknessCard;
