import { getActiveClassesByMonth, getCompletedClassesByMonth, getOngoingClassesByMonth } from '@/data/api';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { useEffect, useState } from 'react'


const getCurrentYear = () => new Date().getFullYear();


const optionsStatus = [
    'active',
    'ongoing',
    'completed'
]
export default function SessionsChart() {
    const [dataClasses, setDataClasses] = useState([])
    const [selectedStatus, setSelectedStatus] = useState(optionsStatus[0]);
    const [selectedYear, setSelectedYear] = useState(getCurrentYear());
    const result = localStorage.getItem("result");
    let token;
    if (result) {
        try {
            const parsedResult = JSON.parse(result);
            token = parsedResult.token;
        } catch (error) {
            console.error("Error parsing result from localStorage:", error);
        }
    }
    const convertDataWithDefault = (input) => {
        const result = [];

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        for (let month = 1; month <= 12; month++) {
            const monthKey = `2024-${month.toString().padStart(2, '0')}`;
            result.push({
                month: monthNames[month - 1],
                value: input[monthKey] || 0
            });
        }

        return result;
    };
    const getActiveClasses = async () => {
        try {
            let res;
            switch (selectedStatus) {
                case 'active':
                    res = await getActiveClassesByMonth(selectedYear, token);
                    break;
                case 'ongoing':
                    res = await getOngoingClassesByMonth(selectedYear, token);
                    break;
                case 'completed':
                    res = await getCompletedClassesByMonth(selectedYear, token);
                    break;
            }
            setDataClasses(convertDataWithDefault(res))
        } catch (error) {
            console.log(error)
        }
    }

    

    useEffect(() => {
        getActiveClasses()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, selectedStatus, selectedYear])


    const handleChange = (e) => {
        setSelectedStatus(e.target.value)
    }

    const handleChangeYear = (e) => {
        setSelectedYear(e.target.value)
    }

    return (
        <div className="flex flex-col justify-center items-center w-full bg-white shadow-lg py-6 rounded-lg px-4">
            <h1 className="font-semibold text-2xl tracking-wider uppercase text-center">Review Sessions Chart</h1>
            <div>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Year</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        label="Year"
                        onChange={handleChangeYear}
                        value={selectedYear}
                        className='bg-white'
                    >
                        {Array.from({ length: 10 }, (_, i) => {
                            const year = getCurrentYear() - 3 + i;
                            return (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Status</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        label="Status"
                        onChange={handleChange}
                        value={selectedStatus}
                        className='bg-white'
                    >
                        {
                            optionsStatus.map((item, index) =>
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            </div>
            <LineChart
                xAxis={[{ scaleType: 'point', data: [...dataClasses.map(item => item.month)] }]}
                series={[
                    {
                        data: [...dataClasses.map(item => item.value)],
                        label: 'Number of review sessions',
                        area: true,
                    },
                ]}
                width={850}
                height={320}
            />
        </div>

    )
}
