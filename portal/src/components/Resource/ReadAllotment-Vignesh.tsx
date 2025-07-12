import React, { useState, useEffect, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';
import styles from './ReadAllotment-Vignesh.module.css';

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const ReadAllotment: React.FC = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const apiUrl = `${apiConfig.getResourceUrl('allotment')}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Allotment')}?`;
  const studentApiUrl = `${apiConfig.getResourceUrl('student')}?`;
  const roomApiUrl = `${apiConfig.getResourceUrl('room')}?`;

  const regex = /^(g_|archived|extra_data)/;

  const fetchStudentById = async (studentId: string) => {
    try {
      const ssid = sessionStorage.getItem('key');
      const params = new URLSearchParams({
        queryId: 'GET_STUDENT_BY_ID',
        session_id: ssid ?? '',
        args: `id:${studentId}`,
      });
      const res = await fetch(studentApiUrl + params.toString());
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      return data.resource?.[0] ?? null;
    } catch {
      return null;
    }
  };

  const fetchRoomById = async (roomId: string) => {
    try {
      const ssid = sessionStorage.getItem('key');
      const params = new URLSearchParams({
        queryId: 'GET_ROOM_BY_ID',
        session_id: ssid ?? '',
        args: `id:${roomId}`,
      });
      const res = await fetch(roomApiUrl + params.toString());
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      return data.resource?.[0] ?? null;
    } catch {
      return null;
    }
  };

  const enrichAllotmentData = async (allotments: any[]) => {
    setLoading(true);
    try {
      const enriched = await Promise.all(
        allotments.map(async (a) => {
          const copy = { ...a };
          if (a.rollnumber) {
            const s = await fetchStudentById(a.rollnumber);
            if (s) copy.rollnumber = s.rollnumber;
          }
          if (a.roomnumber) {
            const r = await fetchRoomById(a.roomnumber);
            if (r) copy.roomnumber = r.roomnumber;
          }
          return copy;
        }),
      );
      setRowData(enriched);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayValue = (row: any, field: string) => {
    switch (field) {
      case 'studentId':
        return row.studentRollNumber ?? row.studentId ?? '-';
      case 'roomId':
        return row.roomNumber ?? row.roomId ?? '-';
      default:
        return row[field] ?? '-';
    }
  };

  const getDisplayName = (field: string) => {
    switch (field) {
      case 'studentId':
        return 'Student Roll Number';
      case 'roomId':
        return 'Room Number';
      default:
        return (
          field.charAt(0).toUpperCase() +
          field.slice(1).replace(/([A-Z])/g, ' $1')
        );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const ssid = sessionStorage.getItem('key');
        const params = new URLSearchParams({
          queryId: 'GET_ALL',
          session_id: ssid ?? '',
        });
        const res = await fetch(apiUrl + params.toString());
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        await enrichAllotmentData(data.resource ?? []);
      } catch (e) {
        console.error(e);
      }
    })();

    (async () => {
      try {
        const res = await fetch(metadataUrl);
        const meta = await res.json();
        const fields = meta?.[0]?.fieldValues ?? [];
        setRequiredFields(
          fields.filter((f: any) => !regex.test(f.name)).map((f: any) => f.name)
        );
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredRows =
    searchQuery.trim() === ''
      ? rowData
      : rowData.filter((r) =>
          (r.roomnumber ?? '')
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );

  const handleRefresh = () => setSearchQuery('');

  const handleExportExcel = () => {
    const visibleFields = requiredFields.filter((f) => f !== 'id');
    const exportRows = filteredRows.map((row, idx) => {
      const obj: Record<string, any> = { 'S.No.': idx + 1 };
      visibleFields.forEach(
        (f) => (obj[getDisplayName(f)] = getDisplayValue(row, f))
      );
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Allotments');
    XLSX.writeFile(wb, 'Allotments.xlsx');
  };

  const handleEdit = (id: any) => {
    const ssid = sessionStorage.getItem('key');

    navigate('/editallotment', {
      state: {
        id: id,
        editedData: { [id]: rowData.find(r => r.id === id) },
        currUrl: window.location.href,
        resName: 'Allotment',
        apiUrl: `${apiConfig.getResourceUrl('allotment')}?`,
        metadataUrl: `${apiConfig.getResourceMetaDataUrl('Allotment')}?`,
        BaseUrl: apiConfig.API_BASE_URL,
      }
    });
  };

  // Edit icon component
  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.1464 1.85355C12.3417 1.65829 12.6583 1.65829 12.8536 1.85355L14.1464 3.14645C14.3417 3.34171 14.3417 3.65829 14.1464 3.85355L5.35355 12.6464C5.25979 12.7402 5.13261 12.7918 5 12.7918H2.5C2.22386 12.7918 2 12.5679 2 12.2918V9.79175C2 9.65914 2.05164 9.53196 2.14645 9.4382L12.1464 1.85355Z"
        stroke="#2196F3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={styles.readAllotmentContainer}>
      <div className={styles.dataGridContainer}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner} />
          </div>
        )}

        <div className={styles.searchSection}>
          <input
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by room number"
          />
          <button className={styles.searchBtn}>🔍︎</button>
          <button
            className={`${styles.searchBtn} ${styles.refreshBtn}`}
            onClick={handleRefresh}
          >
            ⟳
          </button>
          <button
            className={`${styles.export} ${styles.refreshBtn}`}
            onClick={handleExportExcel}
          >
            Export
          </button>
        </div>

        {filteredRows.length === 0 && requiredFields.length === 0 ? (
          <div className={styles.noDataMessage}>
            <div className={styles.noDataIcon}>📊</div>
            <h3 className={styles.noDataTitle}>No Data Available</h3>
            <p className={styles.noDataText}>
              Please add a resource attribute to view allotment data.
            </p>
          </div>
        ) : (
          <div className={styles.customTableContainer}>
            <table className={styles.customTable}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableheadernew}>S.No.</th>
                  {requiredFields
                    .filter((f) => f !== 'id')
                    .map((f, i, arr) => (
                      <th
                        key={f}
                        className={styles.tableHeaderCell}
                      >
                        {getDisplayName(f)}
                      </th>
                    ))}
                  <th className={styles.tableHeaderCell} style={{ borderRight: 'none' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={styles.tableRow}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        '#F8FAFC')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        'transparent')
                    }
                  >
                    <td className={styles.tableCell} style={{ borderRight: 'none' }}>
                      {idx + 1}
                    </td>
                    {requiredFields
                      .filter((f) => f !== 'id')
                      .map((f, fi, arr) => (
                        <td
                          key={fi}
                          className={styles.tableCell}
                        >
                          {getDisplayValue(row, f)}
                        </td>
                      ))}
                    <td className={styles.tableCell} style={{ borderRight: 'none' }}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(row.id)}
                        style={{
                          backgroundColor: 'white',
                          border: '1.5px solid #2196F3',
                          borderRadius: '4px',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '32px',
                          minHeight: '32px'
                        }}
                      >
                        <EditIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showToast && (
        <div className={styles.toastOverlay}>
          <div className={styles.customToast}>
            <div className={styles.toastHeader}>
              <span>Success</span>
              <button
                className={styles.toastClose}
                onClick={() => setShowToast(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.toastBody}>Created successfully!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadAllotment;