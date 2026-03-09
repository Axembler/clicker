const { validateTimestamps, getIntervals, standardDeviation } = require('../services/clickValidation')

/**
 * Генерирует массив timestamps с заданным базовым интервалом и опциональным шумом
 * @param {number} count       — количество timestamps
 * @param {number} interval    — базовый интервал в мс
 * @param {number} jitter      — максимальный случайный разброс ±jitter мс
 * @param {number} startOffset — смещение от Date.now() назад (мс)
 */
function makeTimestamps(count, interval = 100, jitter = 0, startOffset = 25_000) {
  const start = Date.now() - startOffset
  const timestamps = []

  for (let i = 0; i < count; i++) {
    const noise = jitter > 0 ? Math.floor(Math.random() * jitter * 2) - jitter : 0
    timestamps.push(start + i * interval + noise)
  }

  return timestamps.sort((a, b) => a - b)
}

/**
 * Генерирует timestamps с человекоподобными интервалами (σ > MIN_INTERVAL_STD_DEV_MS)
 * Интервалы варьируются от 50 до 500 мс
 */
function makeHumanTimestamps(count, startOffset = 10_000) {
  const humanIntervals = [80, 150, 230, 95, 310, 175, 420, 60, 280, 190,
    340, 110, 260, 370, 130, 450, 85, 200, 320, 155]
  const start = Date.now() - startOffset
  const timestamps = [start]

  for (let i = 1; i < count; i++) {
    const interval = humanIntervals[(i - 1) % humanIntervals.length]
    timestamps.push(timestamps[i - 1] + interval)
  }

  return timestamps
}

describe('getIntervals', () => {
  test('возвращает пустой массив для одного элемента', () => {
    expect(getIntervals([1000])).toEqual([])
  })

  test('корректно вычисляет интервалы для двух элементов', () => {
    expect(getIntervals([1000, 1200])).toEqual([200])
  })

  test('корректно вычисляет интервалы для нескольких элементов', () => {
    expect(getIntervals([100, 243, 412])).toEqual([143, 169])
  })

  test('возвращает нули для одинаковых timestamps', () => {
    expect(getIntervals([500, 500, 500])).toEqual([0, 0])
  })

  test('обрабатывает убывающие timestamps (отрицательные интервалы)', () => {
    expect(getIntervals([300, 200, 100])).toEqual([-100, -100])
  })
})

describe('standardDeviation', () => {
  test('возвращает 0 для массива из одинаковых значений', () => {
    expect(standardDeviation([5, 5, 5, 5])).toBe(0)
  })

  test('корректно вычисляет СКО для известных значений', () => {
    // [2, 4, 4, 4, 5, 5, 7, 9] → μ=5, σ=2
    expect(standardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2, 5)
  })

  test('возвращает положительное число для разных значений', () => {
    expect(standardDeviation([10, 20, 30, 40, 50])).toBeGreaterThan(0)
  })

  test('СКО симметрично — порядок элементов не важен', () => {
    const a = standardDeviation([1, 2, 3, 4, 5])
    const b = standardDeviation([5, 4, 3, 2, 1])
    expect(a).toBeCloseTo(b, 10)
  })
})

describe('validateTimestamps — базовая валидация типов и структуры', () => {
  test('возвращает ошибку если timestamps не массив (строка)', () => {
    expect(validateTimestamps('not an array')).toBe('timestamps должен быть массивом')
  })

  test('возвращает ошибку если timestamps не массив (число)', () => {
    expect(validateTimestamps(42)).toBe('timestamps должен быть массивом')
  })

  test('возвращает ошибку если timestamps не массив (null)', () => {
    expect(validateTimestamps(null)).toBe('timestamps должен быть массивом')
  })

  test('возвращает ошибку если timestamps не массив (объект)', () => {
    expect(validateTimestamps({ 0: 1000 })).toBe('timestamps должен быть массивом')
  })

  test('возвращает ошибку если timestamps не массив (undefined)', () => {
    expect(validateTimestamps(undefined)).toBe('timestamps должен быть массивом')
  })

  test('возвращает ошибку для пустого массива', () => {
    const now = Date.now()
    const result = validateTimestamps([now - 1000, now - 500])
    expect(result).toBeNull()
  })
})

describe('validateTimestamps — проверка дисперсии (антибот)', () => {
  test('не проверяет дисперсию при менее 8 кликах', () => {
    // 7 кликов с идеально равными интервалами — должно пройти
    const now = Date.now()
    const base = now - 10_000
    const timestamps = Array.from({ length: 7 }, (_, i) => base + i * 100)
    expect(validateTimestamps(timestamps)).toBeNull()
  })

  test('возвращает ошибку при ровно 8 кликах с подозрительно равными интервалами', () => {
    // 8 кликов с интервалом ровно 100мс — σ=0, явный бот
    const now = Date.now()
    const base = now - 10_000
    const timestamps = Array.from({ length: 8 }, (_, i) => base + i * 100)
    const result = validateTimestamps(timestamps)
    expect(result).toMatch(/Подозрительные клики/)
  })

  test('возвращает ошибку для умного бота с малым разбросом (σ < 10мс)', () => {
    // Интервалы: 100, 101, 99, 100, 102, 98, 100, 101 — σ ≈ 1.3мс
    const now = Date.now()
    const intervals = [100, 101, 99, 100, 102, 98, 100, 101]
    const timestamps = [now - 15_000]
    intervals.forEach(interval => {
      timestamps.push(timestamps[timestamps.length - 1] + interval)
    })
    const result = validateTimestamps(timestamps)
    expect(result).toMatch(/Подозрительные клики/)
  })

  test('не возвращает ошибку для человекоподобных кликов (σ >= 10мс)', () => {
    const timestamps = makeHumanTimestamps(10)
    expect(validateTimestamps(timestamps)).toBeNull()
  })

  test('не возвращает ошибку для 20 человекоподобных кликов', () => {
    const timestamps = makeHumanTimestamps(20)
    expect(validateTimestamps(timestamps)).toBeNull()
  })
})

describe('validateTimestamps — успешные сценарии', () => {
  test('возвращает null для одного валидного timestamp', () => {
    const now = Date.now()
    expect(validateTimestamps([now - 500])).toBeNull()
  })

  test('возвращает null для двух валидных timestamps', () => {
    const now = Date.now()
    expect(validateTimestamps([now - 1000, now - 500])).toBeNull()
  })

  test('возвращает null для 7 кликов с равными интервалами (без проверки дисперсии)', () => {
    const now = Date.now()
    const base = now - 10_000
    const timestamps = Array.from({ length: 7 }, (_, i) => base + i * 200)
    expect(validateTimestamps(timestamps)).toBeNull()
  })

  test('возвращает null для реалистичного сценария пользователя', () => {
    const timestamps = makeHumanTimestamps(15)
    expect(validateTimestamps(timestamps)).toBeNull()
  })
})

describe('validateTimestamps — граничные случаи', () => {
  test('первая ошибка имеет приоритет — не массив важнее пустого', () => {
    expect(validateTimestamps(null)).toBe('timestamps должен быть массивом')
  })

  test('ошибка типа имеет приоритет над ошибкой интервала', () => {
    const now = Date.now()
    // Первый элемент — не целое число
    const result = validateTimestamps([now - 1000.5, now - 500])
    expect(result).toMatch(/не является целым числом/)
  })

  test('ошибка сортировки имеет приоритет над ошибкой дисперсии', () => {
    const now = Date.now()
    const base = now - 10_000
    // 8 элементов, последний нарушает сортировку
    const timestamps = [
      base,
      base + 100, base + 200, base + 300,
      base + 400, base + 500, base + 600,
      base + 550, // нарушение сортировки
    ]
    const result = validateTimestamps(timestamps)
    expect(result).toMatch(/не отсортированы по возрастанию/)
  })

  test('timestamp ровно на границе будущего (now+1000) не вызывает ошибку', () => {
    const now = Date.now()
    // now+999 — допустимо
    const result = validateTimestamps([now + 999])
    expect(result).toBeNull()
  })
  test('массив из ровно 250 человекоподобных кликов проходит валидацию', () => {
    const timestamps = makeHumanTimestamps(250, 60_000)
    expect(validateTimestamps(timestamps)).toBeNull()
  })

  test('массив из 251 клика возвращает ошибку превышения лимита', () => {
    const ts = makeTimestamps(251, 200, 0, 60_000)
    expect(validateTimestamps(ts)).toBe('Слишком много кликов за один запрос')
  })
})
