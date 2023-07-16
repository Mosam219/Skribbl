import React, { PropsWithChildren } from "react";
import { Snackbar, Alert, Slide, SlideProps, AlertColor } from "@mui/material";

interface AppContextType {
  snack: {
    show: (msg: string, type: AlertColor, hideEarly?: boolean) => void;
  };
}

interface SnackContextState {
  isOpen: boolean;
  type: AlertColor;
  message: string;
}

let snackAutoHideTimer = 5000; // Default 5 seconds
const TransitionRight = (props: SlideProps) => (
  <Slide {...props} direction="left" />
);

const AppContext = React.createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<PropsWithChildren> = (props) => {
  // SnackBar
  const [snackBarState, setSnackBarState] = React.useState<SnackContextState>(
    {} as SnackContextState
  );

  const show = React.useCallback(
    (msg: string, type: AlertColor, hideEarly?: boolean) => {
      setSnackBarState({ isOpen: true, type, message: msg });
      if (hideEarly) snackAutoHideTimer = 2000; // 2 seconds
      else snackAutoHideTimer = 5000; // 5 seconds
    },
    []
  );

  const hide = React.useCallback(() => {
    setSnackBarState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <AppContext.Provider value={{ snack: { show } }}>
      {props.children}
      {snackBarState.isOpen && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={snackBarState.isOpen}
          TransitionComponent={TransitionRight}
          autoHideDuration={snackAutoHideTimer}
          onClose={hide}
          ClickAwayListenerProps={{ onClickAway: () => null }}
        >
          <Alert onClose={hide} severity={snackBarState.type} variant="filled">
            {snackBarState.message}
          </Alert>
        </Snackbar>
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
