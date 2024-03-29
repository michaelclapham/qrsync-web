import { useIonRouter } from "@ionic/react";
import React, { useContext, useEffect } from "react";

type NavigateOnStateChangeProps = { route?: string, onNavigate?: () => void}

export const NavigateOnStateChange: React.FC<NavigateOnStateChangeProps> = ({route, onNavigate}) => {
    const ionRouter = useIonRouter();
    console.log("NavigateOnStateChange", ionRouter);
    useEffect(() => {
      if (route) {
        console.log("Route changed ", route);
        setTimeout(() => {
            ionRouter.push(route);
        });
        if (onNavigate) {
            onNavigate();
        }
      }
    }, [route]);
    return <></>
  }