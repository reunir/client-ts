/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        notification: {
          '0%': {
            'left': '100%',
            'opacity': '1'
          },
          '8%': {
            'left': '78%',
            'opacity': '1'
          },
          '88%': {
            'left': '78%',
            'opacity': '1'
          },
          '100%': {
            'left': '78%',
            'opacity': '0'
          }

        },
        error: {
          '0%': {
            'top': '-70px',
            'opacity': '1'
          },
          '8%': {
            'top': '10px',
            'opacity': '1'
          },
          '88%': {
            'top': '10px',
            'opacity': '1'
          },
          '100%': {
            'top': '10px',
            'opacity': '0'
          }

        },
        header: {
          '0%': {
            'top': '-80px'
          },
          '100%': {
            'top': '0px'
          }
        },
        meetnav: {
          '0%': {
            'height': '70px'
          },
          '100%': {
            'height': '0px'
          }
        }
      },
      animation: {
        notification: 'notification 8s forwards',
        error: 'error 5s forwards',
        header: 'header .5s forwards',
        meetnav: 'meetnav .5s forwards'
      },
      boxShadow: {
        meetGreet: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
      },
    },
  }
}
