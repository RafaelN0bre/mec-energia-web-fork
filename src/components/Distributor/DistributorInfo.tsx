import * as React from 'react';
import { useState, useEffect } from 'react';
import { Badge, Box, Button, Divider, Typography } from '@mui/material'
import { DistributorConsumerUnits, DistributorPropsTariffs } from '../../types/distributor'
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link'
import { Link as MUILink, IconButton } from '@mui/material';
import { TariffTable } from '../Tariff/TariffTable';
import { mockedDistributor } from '../../mocks/mockedDistributor';
import { mockedDistributorComsumerUnit } from '../../mocks/mockedDistributor';
import { setIsTariffEdiFormOpen } from '../../store/appSlice';
import { useDispatch } from 'react-redux';


export const DistributorInfo = () => {
  const router = useRouter();

  const [currentDist, setCurrentDist] = useState<DistributorPropsTariffs>()
  const [currentConsumerUnitList, setCurrentConsumerUnitList] = useState<DistributorConsumerUnits>()
  const [titleTariffs, setTitleTariffs] = useState('Tarifas')
  const [isOverdue, setisOverdue] = useState(false);
  const [isPendingTariffAddition, setIsPendingTariffAddition] = useState(false);
  const dispatch = useDispatch()

  const createTitleTariffs = () => {
    if (currentDist?.tariffs.length === 0) setTitleTariffs('');
    else if (currentDist?.tariffs.length === 1) {
      const tarrif = currentDist.tariffs[0];
      if (isOverdue) setTitleTariffs(`Tarifas do subgrupo ${tarrif.subgroup} pendentes`)
      else setTitleTariffs(`Tarifas do subgrupo ${tarrif.subgroup}`)
    }
    else if (currentDist?.tariffs.length !== 1) {
      if (!isOverdue) setTitleTariffs('Tarifas')
      else setTitleTariffs('Tarifas com atualizações pendentes')
    }
  }

  useEffect(() => {
    const { id } = router.query
    setCurrentDist(mockedDistributor[Number(id) - 1])
    setCurrentConsumerUnitList(mockedDistributorComsumerUnit[Number(id) - 1])

    const overdue = mockedDistributor[Number(id) - 1].tariffs.find(tariff => tariff.overdue === true);
    if (overdue === undefined) setisOverdue(false)
    else setisOverdue(true)
    const hasConsumerUnit = mockedDistributor[Number(id) - 1].consumer_units > 0 ? true : false;
    const needAddTariff = mockedDistributor[Number(id) - 1].tariffs.find(tariff => tariff.start_date === '' && tariff.end_date === '' && hasConsumerUnit);
    if (needAddTariff === undefined) setIsPendingTariffAddition(false)
    else setIsPendingTariffAddition(true)

    createTitleTariffs()

  }, [])

  useEffect(() => {
    createTitleTariffs()
  }, [currentDist])

  useEffect(() => {
    const { id } = router.query
    setCurrentDist(mockedDistributor[Number(id) - 1])
    setCurrentConsumerUnitList(mockedDistributorComsumerUnit[Number(id) - 1])
  }, [router.asPath])

  const handleEditTariffClick = () => {
    dispatch(setIsTariffEdiFormOpen(true));
  };

  return (
    <Box display={'flex'} justifyContent="space-between" width={'100%'} mt={3}>
      <Box flex={7} mr={5} display={currentDist?.consumer_units === 0 || currentDist?.disabled ? 'none' : ''}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant='h5'>{titleTariffs}</Typography>
          {!isPendingTariffAddition &&
            <IconButton onClick={handleEditTariffClick} color="inherit">
              <EditIcon />
            </IconButton>
          }
        </Box>
        <Divider />
        {!isPendingTariffAddition &&
          <TariffTable />
        }
        {isPendingTariffAddition &&
          <Box width={'25%'} display="flex" justifyContent={'space-between'} alignItems={'center'} mt={2}>
            <Badge badgeContent={'!'} color="secondary"></Badge >
            <Button variant="outlined" size="small">
              Adicionar Tarifas
            </Button>

          </Box>
        }

      </Box>
      <Box flex={4}>
        <Typography variant='h5'>
          Unidades Consumidoras
          <Divider />
          {currentDist?.consumer_units === 0 ? (
            <Box>
              <Box ml={3} mt={2} mb={3}>
                <Typography>Nenhuma</Typography>
              </Box>
              <Typography><Box sx={{ color: 'text.secondary' }}>Para ver Tarifas, selecione esta distribuidora no contrato com uma Unidade Consumidora.</Box></Typography>
            </Box>
          ) :
            currentConsumerUnitList?.subgroups[0].consumer_units?.map(consumer_unit => {
              return <ul>
                <li><Typography><Link href={`/uc/${consumer_unit.id}`}><MUILink sx={{ cursor: 'pointer' }} color="inherit">{consumer_unit.name}</MUILink></Link></Typography></li>
              </ul>
            })
          }

          {currentDist?.disabled &&
            <Box sx={{ color: 'text.secondary' }} >
              <Typography>
                Apenas distribuidoras ativas exibem informações de tarifa.
              </Typography>
            </Box>
          }
        </Typography>
      </Box>
    </Box>
  )
}
