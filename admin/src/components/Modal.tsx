import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function Modal({ title, description, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dialogRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1} ref={dialogRef}>
        <div className="modal-heading"><div><p className="eyebrow">Demo interface</p><h2 id="modal-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button></div>
        <p className="modal-description">{description}</p>
        <div className="modal-demo-notice"><span>i</span><p>This preview does not save changes or upload files. Backend features will be added in a later phase.</p></div>
        <form onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>
          <label className="form-field">Title<input autoFocus placeholder="Enter a title" /></label>
          <label className="form-field">Description<textarea rows={3} placeholder="Add a short description (optional)" /></label>
          <label className="demo-upload"><input type="file" accept="image/*,video/*,.pdf" onChange={(event) => event.currentTarget.value = ''} /><span>Choose a file</span><small>Upload preview only · No file is sent or saved</small></label>
          <div className="modal-footer"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">{saved ? <><Check size={16} /> Demo preview</> : 'Preview form'}</button></div>
          {saved && <p className="form-feedback" role="status">This form is a preview only. Nothing has been saved.</p>}
        </form>
      </section>
    </div>
  );
}
