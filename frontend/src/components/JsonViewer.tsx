import React, { useState } from 'react';

interface Props {
  json: any;
}

export const JsonViewer: React.FC<Props> = ({ json }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={() => setOpen(o => !o)}>
        {open ? 'JSONを折りたたむ' : 'JSONを表示'}
      </button>
      {open && (
        <pre style={{ background: '#f5f5f5', padding: 10, overflowX: 'auto' }}>
          {JSON.stringify(json, null, 2)}
        </pre>
      )}
    </div>
  );
};
