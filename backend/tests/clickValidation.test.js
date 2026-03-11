const { groupIntoBursts, validateTimestamps, getIntervals, standardDeviation } = require('../services/clickValidation')

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
    const noise = jitter > 0
      ? Math.floor(Math.random() * jitter * 2) - jitter
      : 0
    timestamps.push(start + i * interval + noise)
  }

  return timestamps.sort((a, b) => a - b)
}

/**
 * Генерирует timestamps с человекоподобными интервалами (σ > MIN_INTERVAL_STD_DEV_MS)
 * Интервалы варьируются от 50 до 500 мс
 */
function makeHumanTimestamps(count, startOffset = 10_000) {
  const humanIntervals = [
    80, 150, 230, 95, 310, 175, 420, 85, 280, 190,
    340, 110, 260, 370, 130, 450, 90, 200, 320, 155,
  ]
  const start = Date.now() - startOffset
  const timestamps = [start]

  for (let i = 1; i < count; i++) {
    const interval = humanIntervals[(i - 1) % humanIntervals.length]
    timestamps.push(timestamps[i - 1] + interval)
  }

  return timestamps
}

/**
 * Генерирует мультитач-пачку: fingerCount касаний в пределах burstSpread ms,
 * затем пауза gapMs до следующей пачки.
 */
function makeMultitouchTimestamps({
  burstCount   = 5,
  fingerCount  = 3,
  burstSpread  = 30,
  startOffset  = 10_000,
} = {}) {
  const start = Date.now() - startOffset
  const timestamps = []

  const humanGaps = [
    150, 210, 95, 340, 180, 260, 120, 390, 170, 280,
    130, 310, 200, 145, 420, 190, 110, 350, 230, 160,
  ]

  let cursor = start

  for (let b = 0; b < burstCount; b++) {
    for (let f = 0; f < fingerCount; f++) {
      timestamps.push(cursor + Math.floor((f / fingerCount) * burstSpread))
    }
    cursor += humanGaps[b % humanGaps.length]
  }

  return timestamps.sort((a, b) => a - b)
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

describe('groupIntoBursts', () => {
  test('каждый клик — отдельная пачка при большом интервале', () => {
    const ts = [1000, 1200, 1400]
    expect(groupIntoBursts(ts)).toEqual([[1000], [1200], [1400]])
  })

  test('три клика за 30ms объединяются в одну пачку', () => {
    const ts = [1000, 1015, 1030]
    expect(groupIntoBursts(ts)).toEqual([[1000, 1015, 1030]])
  })

  test('граничное значение: клик ровно на BURST_WINDOW_MS (50ms) — в той же пачке', () => {
    const ts = [1000, 1050]
    const bursts = groupIntoBursts(ts)
    expect(bursts).toHaveLength(1)
    expect(bursts[0]).toEqual([1000, 1050])
  })

  test('клик через 51ms — новая пачка', () => {
    const ts = [1000, 1051]
    const bursts = groupIntoBursts(ts)
    expect(bursts).toHaveLength(2)
  })

  test('пачка определяется от первого элемента, а не от предыдущего', () => {
    // 1000, 1025, 1050 — все в пределах 50ms от 1000 → одна пачка
    const ts = [1000, 1025, 1050]
    expect(groupIntoBursts(ts)).toHaveLength(1)

    // 1000, 1025, 1051 — 1051 уже > 1000+50 → новая пачка
    const ts2 = [1000, 1025, 1051]
    expect(groupIntoBursts(ts2)).toHaveLength(2)
  })
})

describe('validateTimestamps — базовые проверки', () => {
  test('возвращает ошибку если timestamps не массив', () => {
    expect(validateTimestamps('строка')).toMatch(/массив/)
    expect(validateTimestamps(null)).toMatch(/массив/)
    expect(validateTimestamps(42)).toMatch(/массив/)
  })

  test('возвращает ошибку для пустого массива', () => {
    expect(validateTimestamps([])).toMatch(/пустым/)
  })

  test('возвращает ошибку если кликов больше 250', () => {
    const ts = Array.from({ length: 251 }, (_, i) => Date.now() - 50_000 + i * 100)
    expect(validateTimestamps(ts)).toMatch(/много кликов/)
  })

  test('возвращает ошибку если timestamp не целое число', () => {
    expect(validateTimestamps([Date.now() - 1000, 3.14])).toMatch(/целым числом/)
    expect(validateTimestamps([Date.now() - 1000, '1234567890'])).toMatch(/целым числом/)
  })

  test('возвращает ошибку для timestamp из будущего (+10s)', () => {
    const future = Date.now() + 15_000
    expect(validateTimestamps([future])).toMatch(/будущего/)
  })

  test('возвращает ошибку для слишком старого timestamp (> 60s)', () => {
    const old = Date.now() - 65_000
    expect(validateTimestamps([old])).toMatch(/старый/)
  })
  test('возвращает ошибку для неотсортированного массива', () => {
    const now = Date.now()
    expect(validateTimestamps([now - 500, now - 1000])).toMatch(/отсортированы/)
  })

  test('возвращает null для одного валидного timestamp', () => {
    expect(validateTimestamps([Date.now() - 500])).toBeNull()
  })

  test('возвращает null для двух валидных timestamps', () => {
    const now = Date.now()
    expect(validateTimestamps([now - 1000, now - 500])).toBeNull()
  })
})

describe('validateTimestamps — мультитач (пачки)', () => {
  test('принимает 6 кликов в одной пачке', () => {
    const base = Date.now() - 5_000
    // 6 касаний в пределах 30ms
    const ts = [0, 5, 10, 15, 20, 25].map(d => base + d)
    expect(validateTimestamps(ts)).toBeNull()
  })

  test('возвращает ошибку при 7 кликах в одной пачке', () => {
    const base = Date.now() - 5_000
    const ts = [0, 5, 10, 15, 20, 25, 30].map(d => base + d)
    const result = validateTimestamps(ts)
    expect(result).toMatch(/одновременных кликов/)
  })

  test('принимает реалистичный мультитач (3 клика × 5 пачек)', () => {
    const ts = makeMultitouchTimestamps({ fingerCount: 3, burstCount: 5 })
    expect(validateTimestamps(ts)).toBeNull()
  })

  test('принимает 6 клика × 10 пачек', () => {
    const ts = makeMultitouchTimestamps({ fingerCount: 6, burstCount: 10 })
    expect(validateTimestamps(ts)).toBeNull()
  })

  test('принимает пачки с интервалом ровно 8ms', () => {
    const base = Date.now() - 10_000
    // Пачка 1: base / Пачка 2: base+8
    const ts = [base, base + 8]
    expect(validateTimestamps(ts)).toBeNull()
  })
})

describe('validateTimestamps — проверка дисперсии (антибот)', () => {
  test('не проверяет дисперсию при менее 10 пачках (9 одиночных кликов)', () => {
    const base = Date.now() - 10_000
    // 9 кликов по 100ms = 9 пачек → ниже порога
    const ts = Array.from({ length: 9 }, (_, i) => base + i * 100)
    expect(validateTimestamps(ts)).toBeNull()
  })

  test('возвращает ошибку при ровно 20 одиночных кликах с интервалом 100ms (σ = 0)', () => {
    const base = Date.now() - 20_000
    const ts = Array.from({ length: 20 }, (_, i) => base + i * 100)
    const result = validateTimestamps(ts)
    expect(result).toMatch(/равномерные клики/)
  })

  test('возвращает ошибку для умного бота (σ ≈ 1ms < 8ms)', () => {
    // Интервалы 99–102ms: σ ≈ 1.1ms
    const intervals = [100, 101, 99, 100, 102, 98, 100, 101, 99, 100,
                       101, 100, 101, 99, 100, 102, 98, 100, 101, 99]
    const base = Date.now() - 20_000
    const ts = [base]
    intervals.forEach(d => ts.push(ts.at(-1) + d))
    const result = validateTimestamps(ts)
    expect(result).toMatch(/равномерные клики/)
  })

  test('не возвращает ошибку для 10 человекоподобных кликов (σ >> 8ms)', () => {
    const ts = makeHumanTimestamps(10)
    expect(validateTimestamps(ts)).toBeNull()
  })

  test('не возвращает ошибку для 20 человекоподобных кликов', () => {
    const ts = makeHumanTimestamps(20)
    expect(validateTimestamps(ts)).toBeNull()
  })

  test('не возвращает ошибку для человекоподобного мультитача (σ >> 8ms)', () => {
    // Пачки с человекоподобными интервалами между ними
    const humanGaps = [120, 200, 90, 350, 180, 420, 95, 260, 140, 310]
    const base = Date.now() - 30_000
    const ts = []
    let cursor = base

    humanGaps.forEach(gap => {
      // Пачка из 2–3 пальцев
      ts.push(cursor, cursor + 10, cursor + 20)
      cursor += gap
    })

    expect(validateTimestamps(ts.sort((a, b) => a - b))).toBeNull()
  })
  test('возвращает ошибку для бота с мультитачем и равными интервалами', () => {
    // 10 пачек через ровно 150ms → σ = 0
    const base = Date.now() - 20_000
    const ts = []
    for (let b = 0; b < 10; b++) {
      const burstStart = base + b * 150
      ts.push(burstStart, burstStart + 10, burstStart + 20)
    }
    const result = validateTimestamps(ts.sort((a, b) => a - b))
    expect(result).toMatch(/равномерные клики/)
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

  test('timestamp ровно на границе будущего (now+10000) не вызывает ошибку', () => {
    const now = Date.now()
    // now+9999 — допустимо
    const result = validateTimestamps([now + 9999])
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
