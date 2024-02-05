import { useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

export default function SplineScene({ onMenuOptionClick }) {
  const splineRef = useRef(null);

  // const easyButton = splineRef.current.findObjectById('a8633de4-3935-4d1e-8dfb-f85cbc74c41c');

  // const onSplineLoad = (spline) => {
  //   splineRef.current = spline;
  //   splineRef.current.on('MouseDown', (eventName, objectId) => {
  //     console.log(`Clicked on object: ${objectId}`);
  //     if (objectId === 'a8633de4-3935-4d1e-8dfb-f85cbc74c41c') {
  //       onMenuOptionClick('easy');
  //     }
  //   });
  // };

  const onSplineEvent = (event) => {
    // Check the event type and the name of the object that was interacted with
    if (event.type === 'mouseDown') {
      const objectId = event.target;
      console.log(`Clicked on object: ${objectId}`);
      if (objectId.name === 'Easy') {
        onMenuOptionClick('easy');
      }else if (objectId.name === 'Medium') {
        onMenuOptionClick('medium');
    } else if (objectId.name === 'Hard') {
        onMenuOptionClick('hard');
    } else if (objectId.name === 'Harder') {
        onMenuOptionClick('harder');
    } else if (objectId.name === 'extremely hard') {
        onMenuOptionClick('extremely hard');
    } else if (objectId.name === 'inhuman') {
        onMenuOptionClick('inhuman');
    }
  };
  };

  return (
    <Spline 
      scene="https://prod.spline.design/HziD4n35DHtH6VcK/scene.splinecode"
      onMouseDown={onSplineEvent}
    />
  );
}