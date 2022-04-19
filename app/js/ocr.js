console.log('Running OCR...')

// Register listener for successful scan event to obtain results
const el = document.querySelector('blinkid-in-browser')
console.log(el)

el.addEventListener('scanSuccess', (ev) => {
  // Since UI component uses custom events, data is placed in `detail` property
  console.log('Results', ev.detail)
})
