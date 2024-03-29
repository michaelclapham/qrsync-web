import { useIonRouter } from "@ionic/react";
import React, { useEffect } from "react";

type NavigateOnStateChangeProps = { route?: string, onNavigate?: () => void}

export const NavigateOnStateChange: React.FC<NavigateOnStateChangeProps> = ({route, onNavigate}) => {
    const ionRouter = useIonRouter();
    console.log("NavigateOnStateChange", ionRouter);
    useEffect(() => {
      if (route && ionRouter) {
        console.log("Route changed ", route);
        setTimeout(() => {
            ionRouter.push(route);
        });
        if (onNavigate) {
            onNavigate();
        }
      }
    /* This useEffect should ONLY run when route changes */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);
    return <></>
  }