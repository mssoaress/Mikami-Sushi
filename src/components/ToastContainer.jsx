export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <i className="fas fa-check-circle"></i> {t.message}
        </div>
      ))}
    </div>
  );
}
