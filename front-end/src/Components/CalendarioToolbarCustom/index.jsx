import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { faChevronRight} from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'

export default function CalendarioToolbarCustom({ label, date, onNavigate }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (selectedDate) => {
    onNavigate('DATE', selectedDate);
    setShowPicker(false);
  };

  console.log('Toolbar recebendo props:', { date, onNavigate });

  return (
    <div className="toolbar-container">
      <div className="toolbar-title">
        {format(date, 'MMMM yyyy', { locale: ptBR })}
      </div>

      <div className="toolbar-buttons">
      <button onClick={() => setShowPicker(!showPicker)} title='Escolher dia' className='toolbar-button'><FontAwesomeIcon icon={faCalendar} /></button>
        <button onClick={() => onNavigate('PREV')} title='Voltar' className='toolbar-button'><FontAwesomeIcon icon={faChevronLeft} /></button>
        <button onClick={() => onNavigate('NEXT')} title='Avançar' className='toolbar-button'><FontAwesomeIcon icon={faChevronRight} /></button>
        <button onClick={() => onNavigate('TODAY')} style={{width:"70px"}} className='toolbar-button'>Hoje</button>
        

        {showPicker && (
          <div className="datepicker-wrapper">
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              inline
              locale="pt-BR"
            />
          </div>
        )}
      </div>
    </div>
  );
}
