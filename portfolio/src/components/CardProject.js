import React from 'react';
import '../App.css'; // Import the CSS file

const CardProject = ({ projectTitle, description, imageUrl, tags }) => {
  return (
    <div className="card-project">
      <div className="card-project-content">
        <img src={imageUrl} alt={projectTitle} className="project-image" />
        <div className="project-details">
          <h2 className="project-title">{projectTitle}</h2>
          <p>{description}</p>
          <div className="project-tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
