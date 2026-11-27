import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  const [taskName, setTaskName] = useState('')
  const [editingId, setEditingId] = useState(null)

  const [timerHours, setTimerHours] = useState(0)
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const audioContextRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Sayaç
  useEffect(() => {
    if (!isTimerRunning) return

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning])

  // Süre bitince sesli alarm ve uyarı
  useEffect(() => {
    if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false)
      playAlarm()

      setTimeout(() => {
        alert('Süre doldu! Harika iş çıkardın! 💗')
      }, 200)
    }
  }, [timeLeft, isTimerRunning])

  // Sesli alarm
  const playAlarm = () => {
    const audioContext = audioContextRef.current

    if (!audioContext) return

    const now = audioContext.currentTime

    for (let i = 0; i < 3; i++) {
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()

      oscillator.connect(gain)
      gain.connect(audioContext.destination)

      oscillator.frequency.value = 880
      oscillator.type = 'sine'

      const startTime = now + i * 0.5

      gain.gain.setValueAtTime(0.001, startTime)
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05)
      gain.gain.linearRampToValueAtTime(0.001, startTime + 0.35)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.4)
    }
  }

  // Görev ekleme ve düzenleme
  const addTask = (e) => {
    e.preventDefault()

    if (!taskName.trim()) return

    if (editingId !== null) {
      setTasks(tasks.map(task =>
        task.id === editingId
          ? { ...task, name: taskName }
          : task
      ))

      setEditingId(null)
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          name: taskName,
          completed: false
        }
      ])
    }

    setTaskName('')
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const editTask = (task) => {
    setTaskName(task.name)
    setEditingId(task.id)
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  // Sayacı başlat veya devam ettir
  const startTimer = async () => {
    if (timeLeft === 0) {
      const totalSeconds =
        Number(timerHours) * 3600 +
        Number(timerMinutes) * 60 +
        Number(timerSeconds)

      if (totalSeconds <= 0) {
        alert('Lütfen geçerli bir süre gir.')
        return
      }

      setTimeLeft(totalSeconds)
    }

    // Ses için tarayıcı iznini başlat
    try {
      if (!audioContextRef.current) {
        const AudioContext =
          window.AudioContext || window.webkitAudioContext

        audioContextRef.current = new AudioContext()
      }

      await audioContextRef.current.resume()
    } catch (error) {
      console.log('Ses başlatılamadı:', error)
    }

    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimeLeft(0)
  }

  return (
    <div className="container">

      <header className="header">
        <div className="header-icon">🌸</div>
        <h1>Görev Takip Uygulaması</h1>
        <p>Planla, odaklan ve başarıya ulaş!</p>
      </header>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          placeholder="Yeni görevini yaz..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <button type="submit" className="add-button">
          {editingId !== null ? 'Güncelle' : 'Görev Ekle'}
        </button>
      </form>

      <section className="timer">
        <h2>⏰ Odaklanma Sayacı</h2>

        <p className="timer-description">
          Kendine zaman ayır, hedeflerine odaklan.
        </p>

        <div className="timer-inputs">
          <input
            type="number"
            min="0"
            placeholder="Saat"
            value={timerHours}
            onChange={(e) => setTimerHours(e.target.value)}
            disabled={isTimerRunning}
          />

          <input
            type="number"
            min="0"
            max="59"
            placeholder="Dakika"
            value={timerMinutes}
            onChange={(e) => setTimerMinutes(e.target.value)}
            disabled={isTimerRunning}
          />

          <input
            type="number"
            min="0"
            max="59"
            placeholder="Saniye"
            value={timerSeconds}
            onChange={(e) => setTimerSeconds(e.target.value)}
            disabled={isTimerRunning}
          />
        </div>

        <div className="timer-display">
          {String(Math.floor(timeLeft / 3600)).padStart(2, '0')}:
          {String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0')}:
          {String(timeLeft % 60).padStart(2, '0')}
        </div>

        <div className="timer-buttons">
          <button
            type="button"
            onClick={startTimer}
            disabled={isTimerRunning}
            className="start-button"
          >
            ▶ Başlat
          </button>

          <button
            type="button"
            onClick={pauseTimer}
            disabled={!isTimerRunning}
            className="pause-button"
          >
            ⏸ Duraklat
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="reset-button"
          >
            ↻ Sıfırla
          </button>
        </div>
      </section>

      <section className="task-list">
        <h2>📝 Görevlerim ({tasks.length})</h2>

        {tasks.length === 0 ? (
          <p className="empty">
            Henüz görev eklenmedi. İlk görevini ekle! 💗
          </p>
        ) : (
          tasks.map(task => (
            <div className="task" key={task.id}>
              <span
                className={task.completed ? 'completed' : ''}
                onClick={() => toggleTask(task.id)}
              >
                {task.name}
              </span>

              <div className="task-buttons">
                <button
                  type="button"
                  onClick={() => editTask(task)}
                >
                  Düzenle
                </button>

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="delete-button"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <footer>
        <p>Her küçük adım, büyük bir başarıdır. 🌷</p>
      </footer>

    </div>
  )
}

export default App