import React from 'react';

const projects = [
  { name: 'Project 1', description: 'Description of Project 1' },
  { name: 'Project 2', description: 'Description of Project 2' },
  { name: 'Project 3', description: 'Description of Project 3' },
];

const ProjectContent = ({ projectId }) => {
  const project = projects[projectId];
  return (
    <div style={{ padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
    </div>
  );
};

export default ProjectContent;
