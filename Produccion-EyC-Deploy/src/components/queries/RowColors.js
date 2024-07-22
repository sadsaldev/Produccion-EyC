import React, {useEffect} from "react";
import PropTypes from 'prop-types';

export const RowColors = ({onToggle, onGetColorClass, showColors}) => {
 
    const getColorClass = (priority) => {
        switch (priority) {
            case 'Media':
                return 'yellow';
            case 'Alta':
                return 'red';
            case 'Baja':
                return 'green';
            case 'N MASIVA':
                return 'dark-green';
            case 'Prioridad':
                return 'brown';
            case '60 Meses':
                return 'purple';
            case '2da visita':
                return 'peach';
            default:
                return '';
        }
    };

    useEffect(() => {
        onGetColorClass(getColorClass);
    }, [onGetColorClass]);

    const handleToggleColors = () => {
        onToggle(prevShowColors => !prevShowColors);
    }

    return (
        <div className="show-gdw-colors-container">
            <p>Mostrar colores GDW</p> 
            <label className="switch">
                <input 
                    type="checkbox" 
                    id="toggle-colors"
                    checked={showColors} 
                    onChange={handleToggleColors} 
                />
                <span className="slider"></span>
            </label>
        </div>
    );
}

RowColors.propTypes = {
    onToggle: PropTypes.func.isRequired,
    onGetColorClass: PropTypes.func.isRequired,
    showColors: PropTypes.bool.isRequired
}