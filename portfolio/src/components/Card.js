import React from 'react';
import '../App.css'; 

const Card = ({ date, jobTitle, description, tags, link }) => {
  return (
    <a href={link} className="card-link" target="_blank" rel="noopener noreferrer">
      <div className="card">
        <div className="card-header">
          <span className="date">{date}</span>
        </div>
        <div className="card-body">
          <h2 className="job-title">{jobTitle}</h2>
          <p>{description}</p>
        </div>
        <div className="card-footer">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </a>
  );
};

export default Card;
