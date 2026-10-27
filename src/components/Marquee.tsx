import styles from './marquee.module.css';
const items=['Sites e landing pages','Sistemas sob medida','Automações de rotina','E-commerce','Marketplaces','Integrações e ERP','Gestão de anúncios','Aplicativos internos','Catálogos digitais'];
export default function Marquee(){
  return <div className={styles.strip} aria-label="Frentes de trabalho da MKF Solutions">
    <div className={styles.track}>
      {items.map(t=><span className={styles.item} key={t}><i className={styles.dot} aria-hidden="true"/>{t}</span>)}
      {items.map(t=><span className={styles.item} key={`${t}-copy`} aria-hidden="true"><i className={styles.dot} aria-hidden="true"/>{t}</span>)}
    </div>
  </div>;
}
