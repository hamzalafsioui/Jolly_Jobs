import Swal from 'sweetalert2';

const JOLLY_PURPLE = '#6366f1';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const swalUtils = {
  success: (title, text) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: JOLLY_PURPLE,
    });
  },
  error: (title, text) => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: JOLLY_PURPLE,
    });
  },
  info: (title, text) => {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: JOLLY_PURPLE,
    });
  },
  confirm: (title, text, confirmButtonText = 'Yes, proceed!') => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: JOLLY_PURPLE,
      cancelButtonColor: '#94a3b8',
      confirmButtonText,
    });
  },
  toast: (icon, title) => {
    Toast.fire({
      icon,
      title,
    });
  },
};

export default swalUtils;
