import React from "react"

const ManeSVG: React.FC = () => (
  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
    <defs></defs>
    <path
      style={{
        fill: "none",
        stroke: "rgb(255, 0, 0)",
        strokeWidth: "2px",
      }}
      d="M 224.138 148.687 C 224.138 138.313 224.673 124.984 238.679 126.282 C 243.347 126.715 243.596 135.837 243.596 138.872 C 243.596 140.842 244.803 146.012 243.271 144.773 C 242.209 143.914 246.848 137.664 247.296 136.952 C 250.683 131.579 256.856 120.202 265.252 124.952 C 270.427 127.881 270.156 133.578 267.624 137.895 C 266.671 139.522 265.64 141.133 264.792 142.813 C 264.41 143.57 262.672 145.143 263.51 145.011 C 264.587 144.841 267.262 141.151 267.977 140.401 C 272.205 135.962 281.9 123.711 289.037 130.135 C 293 133.704 291.752 138.955 289.556 143.082 C 288.845 144.419 287.894 145.604 287.144 146.916 C 286.784 147.545 285.23 148.807 285.952 148.737 C 292.936 148.057 305.727 131.728 313.562 138.117 C 318.174 141.878 318.711 155.06 315.753 159.737 C 314.093 162.362 309.759 163.624 307.67 166.203 C 307.596 166.294 305.734 168.523 305.779 168.536 C 307.16 168.918 312.549 164.952 313.654 164.467 C 322.412 160.621 334.848 158.129 340.128 168.516 C 342.575 173.33 339.319 179.042 335.738 182.242 C 334.592 183.265 333.364 184.235 332.049 185.032 C 331.383 185.437 329.32 186.08 330.073 186.283 C 337.596 188.311 350.294 174.914 357.564 181.819 C 367.19 190.963 360.606 213.699 346.155 213.699 C 345.107 213.699 348.251 213.694 349.299 213.699 C 352.128 213.713 354.76 213.879 357.469 214.727 C 364.049 216.789 371.255 222.556 370.065 230.243 C 369.109 236.416 363.2 242.744 357.12 243.78 C 354.935 244.153 352.578 244.543 350.363 244.678 C 349.217 244.748 345.822 245.159 346.92 244.825 C 349.431 244.061 354.042 247.207 356.056 248.359 C 364.938 253.444 369.387 268.383 361.124 276.534 C 356.011 281.578 342.584 280.851 336.963 276.841 C 334.835 275.323 331.13 269.557 329.137 268.992 C 327.373 268.492 330.729 272.302 331.665 273.88 C 333.531 277.028 335.45 280.335 336.546 283.838 C 337.875 288.083 328.754 295.377 325.498 297.314 C 317.821 301.881 302.073 295.513 302.073 285.483 C 302.073 283.928 302.06 288.595 302.166 290.147 C 302.402 293.625 302.563 297.42 302.255 300.905 C 301.696 307.22 290.484 308.547 285.881 308.703 C 278.937 308.937 277.193 305.054 275.481 298.713 C 275.024 297.019 274.436 295.377 273.937 293.698 C 273.705 292.915 273.341 290.505 273.341 291.322 C 273.341 305.882 254.533 316.467 241.582 315.218 C 230.732 314.17 236.252 299.937 239.691 293.96 C 241.043 291.611 242.205 290.165 242.95 287.392 C 243.253 286.262 244.663 283.21 243.786 283.984 C 233.248 293.293 227.277 305.274 211.956 305.274 C 208.5 305.274 204.653 305.492 201.775 303.246 C 200.125 301.959 200.648 298.61 200.72 296.826 C 200.97 290.624 202.664 282.339 206.028 276.972 C 207.341 274.877 213.273 272.156 211.544 269.145 C 211.095 268.362 203.251 271.012 202.536 271.153 C 196.48 272.34 179.272 277.849 176.389 268.088 C 174.08 260.272 178.509 252.249 183.213 246.337 C 184.592 244.604 186.331 243.098 188.152 241.84 C 188.299 241.739 191.491 239.69 191.385 239.529 C 190.948 238.867 180.535 242.172 179.318 242.367 C 168.936 244.036 149.308 248.093 148.711 232.728 C 148.054 215.814 163.541 207.602 178.097 209.961 C 179.646 210.212 184.056 209.669 185.363 210.49 C 185.369 210.494 183 210.256 182.812 210.195 C 180.802 209.533 178.821 208.505 176.993 207.451 C 173.162 205.243 157.813 194.074 162.744 187.871 C 166.868 182.683 175.575 181.152 181.348 183.928 C 183.552 184.989 186.507 188.431 188.778 188.885 C 189.656 189.061 187.892 187.329 187.421 186.568 C 186.595 185.236 185.782 183.888 185.012 182.521 C 183.208 179.318 174.961 166.797 179.235 162.881 C 182.811 159.604 189.479 156.842 194.225 159.27 C 195.935 160.144 197.334 161.803 198.092 163.549 C 198.481 164.445 198.138 166.976 198.901 166.365 C 199.683 165.739 197.852 161.248 197.737 160.826 C 196.735 157.131 191.631 146.219 194.727 142.365 C 204.011 130.803 213.554 146.058 213.554 155.167 C 213.554 155.972 213.447 153.559 213.407 152.755 C 213.338 151.341 213.158 149.936 213.072 148.521 C 212.947 146.437 210.915 133.147 213.201 131.812 C 220.04 127.819 225.006 141.67 225.006 145.905"
    ></path>
  </svg>
)

export default ManeSVG
