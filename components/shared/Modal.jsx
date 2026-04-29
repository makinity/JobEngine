export default function Modal({ children, open }) {
  if (!open) {
    return null;
  }

  return (
    <div role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
