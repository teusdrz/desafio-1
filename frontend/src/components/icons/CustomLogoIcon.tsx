import React from 'react'

interface CustomLogoIconProps {
    className?: string
}

export const CustomLogoIcon: React.FC<CustomLogoIconProps> = ({ className = "w-5 h-5" }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Base do cubo 3D */}
            <path
                d="M12 2L22 8L12 14L2 8L12 2Z"
                fill="currentColor"
                opacity="1"
            />
            {/* Lado esquerdo */}
            <path
                d="M2 8L12 14V22L2 16V8Z"
                fill="currentColor"
                opacity="0.65"
            />
            {/* Lado direito */}
            <path
                d="M12 14L22 8V16L12 22V14Z"
                fill="currentColor"
                opacity="0.8"
            />
            {/* Linhas de estrutura do cubo */}
            <path
                d="M12 2L12 14M2 8L12 14M22 8L12 14"
                stroke="currentColor"
                strokeWidth="0.8"
                fill="none"
                opacity="0.15"
            />
            {/* Detalhes adicionais */}
            <circle
                cx="7"
                cy="10"
                r="1"
                fill="currentColor"
                opacity="0.3"
            />
            <circle
                cx="17"
                cy="10"
                r="1"
                fill="currentColor"
                opacity="0.4"
            />
        </svg>
    )
}

export default CustomLogoIcon
