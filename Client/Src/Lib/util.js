export function formatMessageDateTime(date) {
    return new Date(date).toLocaleTimeString("en-JP",{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
    }