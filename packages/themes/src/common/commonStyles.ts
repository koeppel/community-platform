export const commonStyles = {
  input: {
    borderRadius: 1,
    '&:focus': {
      borderColor: '#83ceeb',
      outline: 'none',
      boxShadow: 'none',
    },
    '&:disabled': {
      color: 'lightgrey',
      cursor: 'not-allowed',
    },
  },
  colors: {
    white: 'white',
    offwhite: '#ececec',
    black: '#1b1b1b',
    softyellow: '#f5ede2',
    blue: '#83ceeb',
    red: '#eb1b1f',
    red2: '#f58d8e',
    softblue: '#e2edf7',
    bluetag: '#5683b0',
    grey: '#61646b',
    green: '#00c3a9',
    error: 'red',
    background: '#f4f6f7',
    silver: '#c0c0c0',
    softgrey: '#c2d4e4',
    lightgrey: '#ababac',
    darkGrey: '#686868',
    subscribed: 'orange',
    notSubscribed: '#1b1b1b',
    betaGreen: '#98cc98',
  },
  alert: {
    borderRadius: 1,
    paddingX: 3,
    paddingY: 3,
    textAlign: 'center',
    fontWeight: 'normal',
  },
  fontFamily: {
    title: `"Varela Round", Arial, sans-serif`,
    body: `'Inter', Arial, sans-serif`,
  },
  space: [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100, 105, 110, 115, 120, 125, 130, 135, 140,
  ],
}
