import Swal from 'sweetalert2';

// Custom Toast instance
export const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
  customClass: {
    popup: 'rounded-2xl shadow-xl text-xs font-medium border border-slate-100',
  },
});

// Notify with toast
export const notifySuccess = (message) => {
  Toast.fire({
    icon: 'success',
    title: message,
  });
};

export const notifyInfo = (message) => {
  Toast.fire({
    icon: 'info',
    title: message,
  });
};

// CRUD Success Modal/Popup
export const showTaskCreatedAlert = (title) => {
  return Swal.fire({
    icon: 'success',
    title: 'Task Created!',
    text: `"${title}" has been added to your schedule.`,
    confirmButtonColor: '#3B5DF7',
    confirmButtonText: 'Great!',
    customClass: {
      popup: 'rounded-3xl p-6 shadow-2xl',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm shadow-md shadow-blue-500/25',
    },
  });
};

export const showTaskUpdatedAlert = (title) => {
  return Swal.fire({
    icon: 'success',
    title: 'Task Updated!',
    text: `"${title}" was successfully updated.`,
    timer: 1800,
    showConfirmButton: false,
    customClass: {
      popup: 'rounded-3xl p-6 shadow-2xl',
    },
  });
};

// SweetAlert2 Delete Confirmation
export const confirmDeleteTask = async (taskTitle) => {
  const result = await Swal.fire({
    title: 'Delete Task?',
    text: taskTitle ? `Are you sure you want to delete "${taskTitle}"?` : 'Are you sure you want to delete this task?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#F43F5E',
    cancelButtonColor: '#94A3B8',
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-3xl p-6 shadow-2xl',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm shadow-md shadow-rose-500/25',
      cancelButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
    },
  });

  return result.isConfirmed;
};

// SweetAlert2 Reset Confirmation
export const confirmResetData = async () => {
  const result = await Swal.fire({
    title: 'Reset Demo Tasks?',
    text: 'This will restore the original Figma mock tasks.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3B5DF7',
    cancelButtonColor: '#94A3B8',
    confirmButtonText: 'Yes, reset',
    cancelButtonText: 'Keep current',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-3xl p-6 shadow-2xl',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
      cancelButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
    },
  });

  return result.isConfirmed;
};

// Generic Error
export const showErrorAlert = (title, message) => {
  return Swal.fire({
    icon: 'error',
    title: title || 'Error',
    text: message || 'Something went wrong',
    confirmButtonColor: '#3B5DF7',
    customClass: {
      popup: 'rounded-3xl p-6 shadow-2xl',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
    },
  });
};

// Info notification (e.g. notifications bell)
export const showInfoAlert = (title, message) => {
  return Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonColor: '#3B5DF7',
    confirmButtonText: 'Got it',
    customClass: {
      popup: 'rounded-3xl p-6 shadow-2xl',
      confirmButton: 'rounded-xl px-5 py-2.5 font-semibold text-sm',
    },
  });
};
