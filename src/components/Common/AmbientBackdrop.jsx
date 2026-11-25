import './AmbientBackdrop.css'

const leaves = [
  [6, 16, -2, 15, 0], [19, 12, -8, 19, 1], [31, 22, -5, 13, 2],
  [44, 10, -11, 21, 3], [57, 18, -3, 16, 4], [69, 14, -9, 18, 5],
  [81, 25, -6, 14, 6], [93, 11, -13, 20, 7], [13, 28, -17, 17, 8],
  [38, 8, -20, 23, 9], [63, 31, -15, 12, 10], [88, 20, -22, 16, 11],
  [25, 35, -27, 19, 12], [74, 6, -24, 22, 13], [50, 26, -30, 15, 14],
  [4, 42, -34, 24, 15], [97, 32, -37, 18, 16], [35, 18, -40, 20, 17],
]

const smallOrbs = [
  ['24%', '24%', 840, '-2s', '12s'], ['68%', '30%', 690, '-7s', '16s'],
  ['76%', '72%', 1020, '-10s', '14s'], ['34%', '76%', 600, '-5s', '18s'],
]

export default function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop" aria-hidden="true">
      <div className="ambient-backdrop-page">
        <div className="ambient-background-orb ambient-orb-one" />
        <div className="ambient-background-orb ambient-orb-two" />
        <div className="ambient-small-orbs">
          {smallOrbs.map(([left, top, size, delay, duration], index) => (
            <span key={index} style={{ '--orb-left': left, '--orb-top': top, '--orb-size': `${size}px`, '--orb-delay': delay, '--orb-duration': duration }} />
          ))}
        </div>
        <div className="ambient-leaves">
          {leaves.map(([left, size, delay, duration, index]) => (
            <span key={index} style={{ '--leaf-left': `${left}%`, '--leaf-size': `${size}px`, '--leaf-delay': `${delay}s`, '--leaf-duration': `${duration}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
