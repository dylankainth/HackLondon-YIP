import ReactDom from 'react-dom'

export default function Modal(props) {
    const { children, handleCloseModal } = props

    return ReactDom.createPortal(
        <div className='fixed inset-0 flex items-center justify-center bg-[rgba(107,114,128,0.5)] z-50'>
            <div className='absolute inset-0' onClick={handleCloseModal}></div>
            <div className='relative z-10 bg-white p-4 rounded-lg shadow-lg' style={{ width: '50vw', height: '50vh' }}>
                {children}
            </div>
        </div>,
        document.getElementById('portal')
    )
}