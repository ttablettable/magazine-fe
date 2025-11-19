import React from 'react';
import styles from './Timeline.module.css';
import TimelineIcons from './TimelineIcons'; // Import the TimelineIcons component

export interface TimelineItem {
    key: string;
    content: React.ReactNode;
    color?: 'green' | 'yellow' | 'purple' | 'pink';
    icon?: 'calendar' | 'handshake' | 'image' | 'medal';
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
    return (
      <div className={styles.timeline}>
        {items.map((item) => (
          <div
            key={item.key}
            className={styles.timelineItem}
          >
            {item.icon ? (
              <div className={styles.timelineIcon}>
                <TimelineIcons name={item.icon} size={20}/>
              </div>
            ) : (
              <div className={`${styles.timelineDot} ${item.color ? styles[`timelineDot-${item.color}`] : ''}`}>
                <div className={styles.defaultDot} />
              </div>
            )}
            <div className={styles.timelineContent}>{item.content}</div>
          </div>
        ))}
      </div>
    );
  };

export default Timeline;
