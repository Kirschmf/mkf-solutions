import {Fragment} from 'react';

type Props = {
  lines: string[];
  className?: string;
  id?: string;
  as?: 'h2' | 'h3';
};

export function MotionHeading({lines, className = '', id, as: Heading = 'h2'}: Props) {
  return <Heading id={id} className={`motion-heading ${className}`} data-motion-heading>
    {lines.map((line, index) => <Fragment key={`${index}-${line}`}>
      <span className="motion-line"><span data-motion-line>{line}</span></span>
      {index < lines.length - 1 ? ' ' : null}
    </Fragment>)}
  </Heading>;
}

export default MotionHeading;
