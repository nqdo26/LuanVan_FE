function CustomArrow({ className, style, onClick, icon }) {
    return (
        <div
            className={className}
            style={{
                ...style,
                fontSize: '35px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                color: 'black',
                zIndex: 10,
            }}
            onClick={onClick}
        >
            {icon}
        </div>
    );
}

export default CustomArrow;
