import React, { useEffect, useRef } from 'react';
import Card from './Card';
import CardProject from './CardProject';
import Divider from './Divider';
import '../App.css';

const LaptopScreenContent = () => {
  const sectionRefs = useRef({});
  const buttonRefs = useRef({});

  useEffect(() => {
    const currentSectionRefs = sectionRefs.current;
    const currentButtonRefs = buttonRefs.current;

    const handleScroll = (entries) => {
      entries.forEach((entry) => {
        const button = currentButtonRefs[entry.target.id];
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

    Object.values(currentSectionRefs).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      Object.values(currentSectionRefs).forEach((section) => {
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
        <div className="nav-footer">
          <a href="https://github.com/LincolnKne" target="_blank" rel="noopener noreferrer">
            <img src="../github.png" alt="GitHub" />
          </a>
          <a href="https://www.linkedin.com/in/lincolnkness/" target="_blank" rel="noopener noreferrer">
            <img src="../Linkedin.png" alt="LinkedIn" />
          </a>
          <a href="mailto:Lincoln.Kness@gmail.com">
            <img src="../Email.png" alt="Email" />
          </a>
          <a href="tel:(563)-503-2199">
            <img src="../Phone.png" alt="Phone" />
          </a>
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
          <Divider />
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
          <Divider />
          <div
            id="projects"
            className="section"
            ref={(el) => (sectionRefs.current['projects'] = el)}
          >
            <CardProject
              projectTitle="ISU Marketplace"
              description="This project involved developing a comprehensive marketplace application, similar to Etsy, using Android Studio and IntelliJ IDEA, where users could buy and sell unique products. As the project leader, I led a team of four developers, coordinating tasks, managing timelines, and ensuring milestones were met."
              imageUrl="../309App.png" 
              tags={['Java', 'Android Studios', 'Intellij', 'Git', 'MySQL']}
            />
            <CardProject
              projectTitle="Nestle Purina NPPC Homepage"
              description="I recreated the homepage for Clinton Factory, replacing the existing SharePoint Online site with a focus on ease of customization and enhanced visual appeal based on departmental requirements. Utilizing Visual Studio Code and React, I designed and developed the new homepage, hosted on our IIS server, and implemented basic React JavaScript for future modifications."
              imageUrl="../NPPCLogo.png" 
              tags={['Javascript', 'React', 'IIS Server']}
            />
            <CardProject
              projectTitle="Pokemon Roguelike"
              description="This solo project involved developing a Pokémon-inspired rogue-like game initially written in C and later translated to C++. The game features procedurally generated terrain, including paths, Pokémon Centers, PokéMarts, tall grass, and water regions. Additional gameplay elements such as battles and item management were integrated, enhancing the overall gaming experience."
              imageUrl="../327PokemonRoguelike.png" 
              tags={['C/C++']}
            />
            <CardProject
              projectTitle="Nestle Purina Cluster Server Backups"
              description="Implemented a reliable backup solution for cluster servers using .bat scripts to automate Snapshot backups, ensuring data integrity and availability. This project aimed to complement the existing Spectrum Backup solution, which was incompatible with the unique drive configurations of the cluster servers."
              imageUrl="../NPPCLogo.png" 
              tags={['.bat Scripts', 'Cluster Server']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopScreenContent;
