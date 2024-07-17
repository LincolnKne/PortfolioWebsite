import React, { useEffect, useRef } from 'react';
import Card from './Card';
import '../App.css';

const LaptopScreenContent = () => {
  const sectionRefs = useRef({});
  const buttonRefs = useRef({});

  useEffect(() => {
    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        const button = buttonRefs.current[entry.target.id];
        if (button) {
          if (entry.isIntersecting) {
            button.classList.add('active');
          } else {
            button.classList.remove('active');
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleScroll, {
      threshold: 0.5,
    });

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleScrollToSection = (sectionId) => {
    if (sectionRefs.current[sectionId]) {
      sectionRefs.current[sectionId].scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="laptop-screen-content">
      <div className="nav">
        <div className="nav-content">
          <h1>Lincoln Kness</h1>
          <h2>Software Engineering Student</h2>
          <h3>
            I strive to build pixel-perfect, accessible,
            <br /> and engaging digital products and experiences.
          </h3>
          <button
            ref={(el) => (buttonRefs.current['about'] = el)}
            onClick={() => handleScrollToSection('about')}
          >
            ABOUT
          </button>
          <button
            ref={(el) => (buttonRefs.current['experience'] = el)}
            onClick={() => handleScrollToSection('experience')}
          >
            EXPERIENCE
          </button>
          <button
            ref={(el) => (buttonRefs.current['projects'] = el)}
            onClick={() => handleScrollToSection('projects')}
          >
            PROJECTS
          </button>
        </div>
      </div>
      <div className="content">
        <div className="content-content">
          <div
            id="about"
            className="section"
            ref={(el) => (sectionRefs.current['about'] = el)}
          >
            <p>
              I am a Software Engineering student at Iowa State University with
              a planned graduation in May 2025. Starting at Iowa State I was in
              the Aerospace Engineering Program which had lasted 2 years. In
              that time, I had taken a few classes over topics like <b>Python</b>{' '}
              and <b>MATLAB</b>. Towards the end of the two years I had found
              out that Aerospace was not for me which led me to pivot to
              Software Engineering as I had enjoyed the coding classes I had
              taken. <br /> <br />
              Now I am going into my senior year as a Software Engineering
              student, and I have worked on a variety of different projects.
              Many of the projects were team-based and solo-based projects. This
              has trained me to be able to understand how the process of working
              on a project differs from in class to real-world scenarios. I have
              done coursework with <b>Java</b>, <b>C/C++</b>, <b>HTML/CSS</b>,{' '}
              <b>Javascript</b>, <b>React</b>, <b>Android Studio</b>, and{' '}
              <b>Intellij</b>.<br /> <br />
              My main focus prior to my senior year has been interning at Nestle
              Purina in Clinton, Iowa. I have enjoyed my time as I have been
              working on web development, and creating a product in <b>React</b>{' '}
              that I am proud of as well as a product that Nestle Purina can
              find easily accessible and efficient.
            </p>
          </div>
          <div
            id="experience"
            className="section"
            ref={(el) => (sectionRefs.current['experience'] = el)}
          >
            <Card
              date="June 2024 — August 2024"
              jobTitle="Information Systems Summer Intern"
              description="Developed and customized a new homepage for Clinton Factory using React and ASP, hosted on IIS. Collaborated with stakeholders to enhance visual appeal and functionality. Implemented automated Snapshot backups using .bat scripts for cluster servers, integrated with Spectrum Backup, ensuring data integrity and availability."
              tags={[
                'JavaScript',
                'HTML',
                'React',
                'IIS Server Configuration',
                '.bat Scripts',
              ]}
              link="https://www.nestlejobs.com/locations/clinton"
            />
          </div>
          <div
            id="projects"
            className="section"
            ref={(el) => (sectionRefs.current['projects'] = el)}
          >
            <h1>Projects</h1>
            <p>This is the Projects section content.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopScreenContent;
