import { ToastContainer, toast, style } from 'react-toastify';
import { css } from 'glamor';

style({
  width: "320px",
  colorDefault: "#000",
  colorInfo: "#3498db",
  colorSuccess: "#07bc0c",
  colorWarning: "#f1c40f",
  colorError: "#e74c3c",
  colorProgressDefault: "linear-gradient(to right, #9d98ff,  #d3d2f8)",
  mobile: "only screen and (max-width : 480px)",
  zIndex: 9999,
  TOP_LEFT: {
    left: '1em'
  },
  TOP_CENTER: {
    marginLeft: `-${320/2}px`,
    left: '50%'
  },
  TOP_RIGHT: {
    right: '1em'
  },
  BOTTOM_LEFT: {
    bottom: '2em',
    left: '1em'
  },
  BOTTOM_CENTER: {
    bottom: '2em',
    marginLeft: `-${320/2}px`,
    left: '50%'
  },
  BOTTOM_RIGHT: {
    bottom: '2em',
    right: '1em'
  }
});

export { ToastContainer, toast, style, css }  ;
