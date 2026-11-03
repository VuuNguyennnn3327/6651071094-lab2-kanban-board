/**
 * Định dạng số tiền thành chuỗi tiền tệ (mặc định VND)
 */
export function formatCurrency(amount: number, currency: string = 'VND'): string {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency || 'VND',
  }).format(amount);

  return formatted;
}

/**
 * Cắt ngắn văn bản nếu vượt quá maxLength và nối thêm '...'
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

/**
 * Kiểm tra địa chỉ email có hợp lệ hay không
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Hàm trì hoãn thực thi (debounce)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };

  return debounced as unknown as T;
}
