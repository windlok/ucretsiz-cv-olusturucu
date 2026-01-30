(function () {
      const showBootError = (err) => {
        const box = document.getElementById('bootError');
        const detail = document.getElementById('bootErrorDetail');
        if (box) box.style.display = 'block';
        if (detail) detail.textContent = err ? String(err) : '';
      };

      const loadScript = (src) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve(src);
        s.onerror = () => reject(new Error(`Script yÃ¼klenemedi: ${src}`));
        document.head.appendChild(s);
      });

      const ensureVue = async () => {
        if (window.Vue) return;
        try {
          await loadScript('https://unpkg.com/vue@3/dist/vue.global.prod.js');
        } catch {
          await loadScript('https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js');
        }
        if (!window.Vue) throw new Error('Vue yÃ¼klenemedi.');
      };

      const ensureHtml2Pdf = async () => {
        if (window.html2pdf) return;
        try {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
        } catch {
          await loadScript('https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js');
        }
      };

      const startApp = () => {
        const { createApp, computed } = Vue;

    function uid() {
      // Tek dosya iÃ§in yeterli benzersizlik
      return Math.random().toString(16).slice(2) + Date.now().toString(16);
    }

      createApp({
      setup() {
        const defaultModel = () => ({
          firstName: 'AyÅŸe',
          lastName: 'YÄ±lmaz',
          title: 'Frontend Developer',
          summary: 'KullanÄ±cÄ± odaklÄ± arayÃ¼zler geliÅŸtiren, performans ve eriÅŸilebilirliÄŸi Ã¶nemseyen Frontend Developer. Vue.js ve modern CSS yaklaÅŸÄ±mlarÄ±yla Ã¶lÃ§eklenebilir Ã¼rÃ¼nler geliÅŸtirdim. ÃœrÃ¼n metriklerini iyileÅŸtirmeye ve ekip iÃ§i iÅŸ birliÄŸine odaklanÄ±rÄ±m.',
          contact: {
            email: 'ayse.yilmaz@mail.com',
            phone: '+90 5xx xxx xx xx',
            location: 'Ä°stanbul, TR',
            linkedin: 'linkedin.com/in/ayseyilmaz',
            website: 'https://portfolio.example'
          },
          experiences: [
            {
              id: uid(),
              company: 'ABC Teknoloji',
              role: 'Frontend Developer',
              start: '2023-02',
              end: 'Devam',
              location: 'Remote',
              description: '- Vue 3 ile modÃ¼ler bileÅŸen mimarisi kurdum\n- Lighthouse performans skorunu 68 â†’ 92 yÃ¼kselttim\n- TasarÄ±m sistemi (Tailwind) ile tutarlÄ± UI geliÅŸtirdim'
            }
          ],
          education: [
            {
              id: uid(),
              school: 'Ä°stanbul Ãœniversitesi',
              program: 'Bilgisayar MÃ¼hendisliÄŸi',
              start: '2019',
              end: '2023',
              notes: 'GPA 3.45/4.00'
            }
          ],
          projects: [
            {
              id: uid(),
              name: 'CV OluÅŸturucu',
              tech: 'Vue 3, Tailwind CSS',
              link: 'https://github.com/kullanici/cv-olusturucu',
              description: '- Vue reactivity ile anlÄ±k Ã¶nizleme\n- A4 yazdÄ±rma (PDF) ve ATS uyumlu sade Ã§Ä±ktÄ±'
            }
          ],
          certifications: [
            {
              id: uid(),
              name: 'AZ-900 (Ã–rnek)',
              issuer: 'Microsoft',
              year: '2025',
              link: ''
            }
          ],
          languages: [
            {
              id: uid(),
              name: 'Ä°ngilizce',
              level: 'B2'
            }
          ],
          skills: 'Vue.js, JavaScript, HTML5, CSS3, Tailwind CSS, Git'
        });

        const cv = Vue.reactive(defaultModel());
        const atsMode = Vue.ref(true);
        const forceAtsOnPrint = Vue.ref(true);
        const sections = Vue.reactive({
          summary: true,
          skills: true,
          experience: true,
          education: true,
          projects: false,
          certifications: false,
          languages: false
        });

        const fullName = computed(() => {
          const first = (cv.firstName || '').trim();
          const last = (cv.lastName || '').trim();
          return [first, last].filter(Boolean).join(' ');
        });

        const hasAnyContact = computed(() => {
          const c = cv.contact || {};
          return Boolean(
            (c.email || '').trim() ||
            (c.phone || '').trim() ||
            (c.location || '').trim() ||
            (c.linkedin || '').trim() ||
            (c.website || '').trim()
          );
        });

        const contactItems = computed(() => {
          const c = cv.contact || {};
          return [c.email, c.phone, c.location, c.linkedin, c.website]
            .map(v => (v || '').trim())
            .filter(Boolean);
        });

        const allExperienceBulletsCount = computed(() => {
          return (cv.experiences || []).reduce((acc, exp) => acc + bulletLines(exp.description).length, 0);
        });

        const atsChecks = computed(() => {
          const nameOk = fullName.value.length >= 4;
          const titleOk = (cv.title || '').trim().length >= 2;
          const contactOk = (cv.contact.email || '').trim().length > 0 || (cv.contact.phone || '').trim().length > 0;
          const summaryOk = (cv.summary || '').trim().length >= 120;
          const expOk = (cv.experiences || []).length > 0;
          const bulletsOk = allExperienceBulletsCount.value >= 2;
          const skillsOk = skillsList.value.length >= 5 || !sections.skills;
          return [
            { label: 'Ä°sim + soyisim dolu', ok: nameOk },
            { label: 'Ãœnvan dolu', ok: titleOk },
            { label: 'E-posta veya telefon var', ok: contactOk },
            { label: 'Ã–zet yeterince aÃ§Ä±klayÄ±cÄ± (â‰¥ 120 karakter)', ok: summaryOk || !sections.summary },
            { label: 'En az 1 deneyim', ok: expOk || !sections.experience },
            { label: 'Deneyimde en az 2 madde', ok: bulletsOk || !sections.experience },
            { label: 'Yetenekler (â‰¥ 5 anahtar kelime)', ok: skillsOk }
          ];
        });

        const skillsList = computed(() => {
          return (cv.skills || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        });

        const skillsText = computed(() => {
          // ATS modunda virgÃ¼l ile; ekranda daha "gÃ¼zel" gÃ¶rÃ¼nÃ¼m iÃ§in nokta kullanÄ±labilir.
          return atsMode.value ? skillsList.value.join(', ') : skillsList.value.join(' â€¢ ');
        });

        const bulletLines = (text) => {
          const raw = (text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          // KullanÄ±cÄ± "-" ile baÅŸlatmÄ±ÅŸsa onu temizle
          return raw.map(l => l.replace(/^[-â€¢]\s*/,'')).filter(Boolean);
        };

        const addExperience = () => {
          cv.experiences.push({
            id: uid(),
            company: '',
            role: '',
            start: '',
            end: '',
            location: '',
            description: ''
          });
        };

        const removeExperience = (id) => {
          cv.experiences = cv.experiences.filter(e => e.id !== id);
        };

        const addEducation = () => {
          cv.education.push({
            id: uid(),
            school: '',
            program: '',
            start: '',
            end: '',
            notes: ''
          });
        };

        const removeEducation = (id) => {
          cv.education = cv.education.filter(e => e.id !== id);
        };

        const addProject = () => {
          cv.projects.push({
            id: uid(),
            name: '',
            tech: '',
            link: '',
            description: ''
          });
        };

        const removeProject = (id) => {
          cv.projects = cv.projects.filter(p => p.id !== id);
        };

        const addCertification = () => {
          cv.certifications.push({
            id: uid(),
            name: '',
            issuer: '',
            year: '',
            link: ''
          });
        };

        const removeCertification = (id) => {
          cv.certifications = cv.certifications.filter(c => c.id !== id);
        };

        const addLanguage = () => {
          cv.languages.push({
            id: uid(),
            name: '',
            level: ''
          });
        };

        const removeLanguage = (id) => {
          cv.languages = cv.languages.filter(l => l.id !== id);
        };

        let restoreAtsMode = null;
        const a4Selector = '.print-area .a4';

        const safeFilename = (name) => {
          const base = (name || 'CV').toString().trim() || 'CV';
          return base
            .replace(/[\\/:*?"<>|]+/g, '-')
            .replace(/\s+/g, ' ')
            .slice(0, 80);
        };

        const getA4Element = () => {
          return document.querySelector(a4Selector);
        };

        const getA4HtmlForExport = () => {
          const el = getA4Element();
          if (!el) return '';

          const clone = el.cloneNode(true);
          // Ekran gÃ¶lgesi / yardÄ±mcÄ± metinler export'ta olmasÄ±n
          clone.classList.remove('paper-shadow');
          clone.querySelectorAll('.no-print, .placeholder').forEach(n => n.remove());

          // Export Ã§Ä±ktÄ±sÄ±nda linkler dÃ¼z metin olarak kalsÄ±n (ATS iÃ§in daha stabil)
          clone.querySelectorAll('a').forEach(a => {
            const span = document.createElement('span');
            span.textContent = a.textContent || a.getAttribute('href') || '';
            a.replaceWith(span);
          });

          return clone.outerHTML;
        };

        const escapeHtml = (s) => {
          return (s ?? '').toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        };

        const buildExportHtml = () => {
          // Temiz, tek kolon, ATS-friendly HTML. (Tailwind class'larÄ± yok, script yok)
          const name = escapeHtml(fullName.value || 'Ad Soyad');
          const title = escapeHtml((cv.title || '').trim() || 'Ãœnvan');
          const contact = contactItems.value.map(escapeHtml).join(' | ');
          const summary = escapeHtml((cv.summary || '').trim());
          const skills = escapeHtml(skillsList.value.join(', '));

          const sectionTitle = (t) => `<div style="margin-top:14px; font-weight:700; font-size:12px; letter-spacing:.08em; color:#475569; text-transform:uppercase;">${escapeHtml(t)}</div>`;
          const hr = `<div style="height:1px; background:#e2e8f0; margin-top:10px;"></div>`;

          const bullets = (text) => {
            const items = bulletLines(text || '');
            if (!items.length) return '';
            const lis = items.map(i => `<li style="margin:0 0 4px 0;">${escapeHtml(i)}</li>`).join('');
            return `<ul style="margin:6px 0 0 18px; padding:0;">${lis}</ul>`;
          };

          const experiences = (cv.experiences || []).map(exp => {
            const role = escapeHtml((exp.role || '').trim() || 'Pozisyon');
            const company = escapeHtml((exp.company || '').trim());
            const loc = escapeHtml((exp.location || '').trim());
            const start = escapeHtml((exp.start || '').trim());
            const end = escapeHtml((exp.end || '').trim());
            const header = `${role}${company ? ' - ' + company : ''}`;
            const meta = [start || 'â€”', end || 'â€”'].join(' â€“ ');
            return `
              <div style="margin-top:10px;">
                <div style="display:flex; justify-content:space-between; gap:12px;">
                  <div>
                    <div style="font-weight:700; color:#0f172a;">${header}</div>
                    ${loc ? `<div style="font-size:12px; color:#475569;">${loc}</div>` : ''}
                  </div>
                  <div style="font-size:12px; color:#475569; white-space:nowrap;">${meta}</div>
                </div>
                ${bullets(exp.description)}
              </div>
            `;
          }).join('');

          const education = (cv.education || []).map(edu => {
            const school = escapeHtml((edu.school || '').trim() || 'Okul');
            const program = escapeHtml((edu.program || '').trim() || 'BÃ¶lÃ¼m / Program');
            const notes = escapeHtml((edu.notes || '').trim());
            const start = escapeHtml((edu.start || '').trim());
            const end = escapeHtml((edu.end || '').trim());
            const meta = [start || 'â€”', end || 'â€”'].join(' â€“ ');
            return `
              <div style="margin-top:10px;">
                <div style="display:flex; justify-content:space-between; gap:12px;">
                  <div>
                    <div style="font-weight:700; color:#0f172a;">${school}</div>
                    <div style="color:#0f172a;">${program}</div>
                    ${notes ? `<div style="font-size:12px; color:#475569;">${notes}</div>` : ''}
                  </div>
                  <div style="font-size:12px; color:#475569; white-space:nowrap;">${meta}</div>
                </div>
              </div>
            `;
          }).join('');

          const projects = (cv.projects || []).map(p => {
            const n = escapeHtml((p.name || '').trim() || 'Proje');
            const tech = escapeHtml((p.tech || '').trim());
            const link = escapeHtml((p.link || '').trim());
            return `
              <div style="margin-top:10px;">
                <div style="font-weight:700; color:#0f172a;">${n}${tech ? ' â€” ' + tech : ''}</div>
                ${link ? `<div style="font-size:12px; color:#475569;">${link}</div>` : ''}
                ${bullets(p.description)}
              </div>
            `;
          }).join('');

          const certs = (cv.certifications || []).map(c => {
            const n = escapeHtml((c.name || '').trim() || 'Sertifika');
            const issuer = escapeHtml((c.issuer || '').trim());
            const year = escapeHtml((c.year || '').trim());
            const link = escapeHtml((c.link || '').trim());
            const meta = [issuer, year, link].filter(Boolean).join(' â€¢ ');
            return `
              <div style="margin-top:10px;">
                <div style="font-weight:700; color:#0f172a;">${n}</div>
                ${meta ? `<div style="font-size:12px; color:#475569;">${meta}</div>` : ''}
              </div>
            `;
          }).join('');

          const langs = (cv.languages || []).map(l => {
            const n = escapeHtml((l.name || '').trim() || 'Dil');
            const level = escapeHtml((l.level || '').trim());
            return `
              <div style="margin-top:6px; display:flex; justify-content:space-between; gap:12px;">
                <div style="font-weight:700; color:#0f172a;">${n}</div>
                <div style="color:#0f172a;">${level || 'â€”'}</div>
              </div>
            `;
          }).join('');

          const parts = [];
          parts.push(`<div style="font-family: Calibri, Arial, sans-serif; color:#0f172a; line-height:1.35;">
            <div style="font-size:24px; font-weight:800;">${name}</div>
            <div style="margin-top:2px; font-size:14px; font-weight:600; color:#334155;">${title}</div>
            <div style="margin-top:6px; font-size:12px; color:#334155;">${contact || 'Ä°letiÅŸim bilgileri'}</div>
            ${hr}
          `);

          if (sections.summary) {
            parts.push(sectionTitle('Ã–zet'));
            parts.push(`<div style="margin-top:6px; font-size:13px; color:#0f172a;">${summary || 'KÄ±sa bir profesyonel Ã¶zet yazÄ±n.'}</div>`);
          }

          if (sections.skills && skillsList.value.length) {
            parts.push(sectionTitle('Yetenekler'));
            parts.push(`<div style="margin-top:6px; font-size:13px; color:#0f172a;">${skills}</div>`);
          }

          if (sections.experience && (cv.experiences || []).length) {
            parts.push(sectionTitle('Deneyim'));
            parts.push(experiences);
          }

          if (sections.education && (cv.education || []).length) {
            parts.push(sectionTitle('EÄŸitim'));
            parts.push(education);
          }

          if (sections.projects && (cv.projects || []).length) {
            parts.push(sectionTitle('Projeler'));
            parts.push(projects);
          }

          if (sections.certifications && (cv.certifications || []).length) {
            parts.push(sectionTitle('Sertifikalar'));
            parts.push(certs);
          }

          if (sections.languages && (cv.languages || []).length) {
            parts.push(sectionTitle('Diller'));
            parts.push(langs);
          }

          parts.push(`</div>`);
          return parts.join('');
        };

        Vue.onMounted(() => {
          window.addEventListener('afterprint', () => {
            if (restoreAtsMode !== null) {
              atsMode.value = restoreAtsMode;
              restoreAtsMode = null;
            }
          });
        });

        const downloadPdf = () => {
          // Kurumsal ATS taramalarÄ±nda en gÃ¼venlisi: yazdÄ±rma/PDF sÄ±rasÄ±nda ATS Modu aÃ§Ä±k olsun.
          restoreAtsMode = atsMode.value;
          if (forceAtsOnPrint.value) {
            atsMode.value = true;
          }
          // DOM gÃ¼ncellensin diye kÃ¼Ã§Ã¼k gecikme
          setTimeout(() => window.print(), 50);
        };

        const exportPdfFile = async () => {
          // Direkt PDF dosyasÄ± Ã¼retir (indirir). BazÄ± ATS'ler PDF'i daha iyi parse eder.
          restoreAtsMode = atsMode.value;
          if (forceAtsOnPrint.value) {
            atsMode.value = true;
          }

          await Vue.nextTick();
          if (typeof html2pdf === 'undefined') {
            // Fallback: yazdÄ±rma penceresi
            setTimeout(() => window.print(), 50);
            return;
          }

          // Temiz export HTML'ini geÃ§ici bir container'a basÄ±p onu PDF'e Ã§evir
          const wrapper = document.createElement('div');
          wrapper.style.position = 'fixed';
          wrapper.style.left = '-9999px';
          wrapper.style.top = '0';
          wrapper.style.width = '210mm';
          wrapper.style.background = '#ffffff';
          wrapper.innerHTML = `<div style="width:210mm; padding:12mm; box-sizing:border-box;">${buildExportHtml()}</div>`;
          document.body.appendChild(wrapper);
          const element = wrapper.firstElementChild;

          const fileBase = safeFilename(fullName.value || 'CV');
          const opt = {
            margin: [10, 10, 10, 10],
            filename: `${fileBase}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff'
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          // html2pdf iÅŸleminden sonra cleanup + ATS modunu geri al
          try {
            await html2pdf().set(opt).from(element).save();
          } finally {
            wrapper.remove();
            if (restoreAtsMode !== null) {
              atsMode.value = restoreAtsMode;
              restoreAtsMode = null;
            }
          }
        };

        const exportWord = async () => {
          // Word iÃ§in pratik export: HTML iÃ§eriÄŸini .doc olarak indir (Word aÃ§ar).
          restoreAtsMode = atsMode.value;
          if (forceAtsOnPrint.value) {
            atsMode.value = true;
          }
          await Vue.nextTick();

          const bodyHtml = buildExportHtml();
          if (!bodyHtml) return;

          const fileBase = safeFilename(fullName.value || 'CV');
          const wordHtml = `
<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <title>${fileBase}</title>
  <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
  <style>
    body{ font-family: Calibri, Arial, sans-serif; color:#0f172a; }
    .a4{ width: 210mm; }
    h1,h2{ margin:0; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;

          const blob = new Blob([wordHtml], { type: 'application/msword' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${fileBase}.doc`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);

          if (restoreAtsMode !== null) {
            atsMode.value = restoreAtsMode;
            restoreAtsMode = null;
          }
        };

        const selectAllSections = (value) => {
          sections.summary = value;
          sections.skills = value;
          sections.experience = value;
          sections.education = value;
          sections.projects = value;
          sections.certifications = value;
          sections.languages = value;
        };

        const resetAll = () => {
          const fresh = defaultModel();
          // reactive objeyi koruyarak alanlarÄ± gÃ¼ncelle
          cv.firstName = fresh.firstName;
          cv.lastName = fresh.lastName;
          cv.title = fresh.title;
          cv.summary = fresh.summary;
          cv.contact = { ...fresh.contact };
          cv.experiences = fresh.experiences.map(e => ({ ...e, id: uid() }));
          cv.education = fresh.education.map(e => ({ ...e, id: uid() }));
          cv.projects = fresh.projects.map(p => ({ ...p, id: uid() }));
          cv.certifications = fresh.certifications.map(c => ({ ...c, id: uid() }));
          cv.languages = fresh.languages.map(l => ({ ...l, id: uid() }));
          cv.skills = fresh.skills;
        };

        return {
          cv,
          atsMode,
          forceAtsOnPrint,
          sections,
          fullName,
          hasAnyContact,
          contactItems,
          atsChecks,
          skillsList,
          skillsText,
          bulletLines,
          addExperience,
          removeExperience,
          addEducation,
          removeEducation,
          addProject,
          removeProject,
          addCertification,
          removeCertification,
          addLanguage,
          removeLanguage,
          downloadPdf,
          exportPdfFile,
          exportWord,
          selectAllSections,
          resetAll
        };
          }
        }).mount('#app');
      };

      (async () => {
        try {
          await ensureVue();
          await ensureHtml2Pdf();
          startApp();
        } catch (e) {
          showBootError(e);
        }
      })();
    })();
