if (current) {
  const initials = current.name
    ? current.name.split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase()
    : "U"

  return (
    <div
      style={{
        position: 'relative',
        padding: '26px',
        borderRadius: '22px',
        background: 'rgba(15, 6, 26, 0.55)',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        boxShadow: '0 12px 45px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        marginBottom: '30px',
        fontFamily: 'Poppins, Inter, sans-serif'
      }}
    >
      {/* Aurora */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(900px 500px at -10% 120%, rgba(168,85,247,0.18), transparent 65%),' +
            'radial-gradient(700px 400px at 110% -20%, rgba(139,92,246,0.16), transparent 60%),' +
            'radial-gradient(800px 450px at 50% 120%, rgba(99,102,241,0.12), transparent 65%)',
          animation: 'auroraShift 12s ease-in-out infinite alternate'
        }}
      />

      {/* Border glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '22px',
          padding: '1.5px',
          background: 'linear-gradient(120deg, rgba(168,85,247,0.55), rgba(139,92,246,0.35), rgba(99,102,241,0.45))',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          opacity: 0.7
        }}
      />

      {/* Content */}
      <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between', alignItems:'center' }}>

        {/* LEFT */}
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>

          {/* Initials badge */}
          <div
            style={{
              minWidth: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(168,85,247,0.18)',
              border: '1px solid rgba(168,85,247,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              animation: 'avatarPulse 3.6s ease-in-out infinite'
            }}
          >
            {initials}
          </div>

          {/* User data */}
          <div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                marginBottom: 3,
                background: 'linear-gradient(90deg, rgba(236,223,255,1), rgba(198,173,255,0.85))',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              {current.name}
            </div>

            {/* Phone */}
            <div style={{ opacity:0.9, display:'flex', alignItems:'center', gap:6 }}>
              📞 <span>{current.phone}</span>
            </div>

            {/* Instagram ✅ возвращён */}
            {current.instagram && (
              <div style={{ opacity:0.85, display:'flex', alignItems:'center', gap:6 }}>
                📸 <span>{current.instagram}</span>
              </div>
            )}

            {/* Email */}
            {current.email && (
              <div style={{ opacity:0.85, display:'flex', alignItems:'center', gap:6 }}>
                ✉️ <span>{current.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — LOGOUT */}
        <button
          onClick={logout}
          style={{
            padding: '6px 14px',
            fontSize: '0.85rem',
            borderRadius: '10px',
            border: '1px solid rgba(168,85,247,0.5)',
            background: 'rgba(168,85,247,0.12)',
            color: '#fff',
            cursor: 'pointer',
            transition: '0.25s',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(6px)',
            width: '50%'  // ✅ уменьшено на 50%
          }}
        >
          {t('logout')}
        </button>

      </div>
    </div>
  )
}
