export const formatNumber = (n: number | undefined): string => {
    if (n === undefined) return '0'
    
    return n >= 1_000_000
        ? `${(n / 1_000_000).toFixed(1)}M`
        : n >= 1_000
        ? `${(n / 1_000).toFixed(1)}K`
        : String(n)
}
