import { selectSucessNotification, setIsSucessNotificationOpen } from "@/store/appSlice"
import { Alert, Snackbar } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"

const SucessNotification = () => {

  const dispatch = useDispatch()
  const notificationProps = useSelector(selectSucessNotification)
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setIsSucessNotificationOpen({
      isOpen: false,
    }))
  };
  return (
    <Snackbar
      open={notificationProps.isOpen}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    >
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        {notificationProps.text}
      </Alert>
    </Snackbar>
  )
}
export default SucessNotification;