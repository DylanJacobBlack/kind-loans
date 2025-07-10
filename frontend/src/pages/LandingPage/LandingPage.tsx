import { Box, Button, Typography, Card, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef, useState, forwardRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { brand } from '../../theme/customizations/themePrimitives';
import intro from '../../assets/intro.png';
import LoanProfile from '../../types/LoanProfile';
import { BorrowerCardWithProgress } from './components/BorrowerCard';
import LandPageCarousel from './components/LandingPageCarousel';
import SearchDialog from './components/SearchDialog';
import SortFilterPopover from './components/SortFilterPopper';
import {
    BellIcon,
    DistributingFundsIcon,
    PostingIcon,
    RepaymentIcon,
} from '../../assets/icons.tsx';

function SectionDivider() {
    return (
        <Box display="flex" justifyContent="center">
            <Divider sx={{ width: '80%' }} />
        </Box>
    );
}

export default function LandingPage() {
    const loanListRef = useRef<HTMLDivElement>(null);

    const scrollToLoans = () => {
        loanListRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Box>
            <HeroSection onBrowseClick={scrollToLoans} />
            <LoanListSection ref={loanListRef} />
            <SectionDivider />
            <StoriesSection />
            <SectionDivider />
            <HowItWorksSection />
            <SectionDivider />
            <VisionSection />
        </Box>
    );
}

function HeroSection({ onBrowseClick }: { onBrowseClick: () => void }) {
    return (
        <Box
            display="flex"
            alignItems="end"
            sx={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${intro})`,
                height: 568,
                color: 'white',
            }}
        >
            <Box m={4}>
                <Typography variant="h2" gutterBottom>
                    <strong>Fuel a woman’s business with just $25.</strong>
                </Typography>
                <Typography variant="h4" gutterBottom>
                    100% of your loan goes to women entrepreneurs building small businesses in rural Uganda.
                </Typography>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={onBrowseClick}
                    sx={{ mt: 2, bgcolor: brand.primary }}
                >
                    How does Kind Loans work?
                </Button>
            </Box>
        </Box>
    );
}

function VisionSection() {
    return (
        <Box m={4}>
            <Typography variant="h3">
                Our <Typography variant="h3" component="span" sx={{ color: brand.greenDark }}>Vision</Typography>
            </Typography>
            <Typography variant="body2" sx={{ mt: 2}}>
                The Kind Loans App was created by the <u>Murphy Charitable Foundation (MCF)</u> to meet the needs of poor women entrepreneurs in Uganda who lack access to traditional banks.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
                This app enables lenders to easily fund <strong>interest-free micro-loans for women entrepreneurs in Uganda</strong>, enabling them to start and grow their small businesses, pursue education, and improve the quality of life for their families.
            </Typography>
        </Box>
    );
}

const steps = [
    { icon: PostingIcon, title: 'Post', description: 'Women entrepreneurs post their requests to borrow money (i.e., loan request) on Kind Loans' },
    { icon: DistributingFundsIcon, title: 'Fund', description: 'Lenders (like you) choose which loan requests to support - 100% of your loan goes directly to them.' },
    { icon: BellIcon, title: 'Stay Connected', description: 'During the loan period, you’ll get updates directly from the entrepreneur about how your support is helping their business grow.' },
    { icon: RepaymentIcon, title: 'Get Repaid', description: "Every 3 months, you'll receive updates directly from the entrepreneur about how your support is helping their business grow." },
];

function HowItWorksSection() {
    const theme = useTheme();
    return (
        <Box m={4}>
            <Typography variant="h3">
                How <Typography variant="h3" component="span" sx={{ color: brand.greenDark }}>Kind Loan</Typography> Works
            </Typography>
            {steps.map((step, index) => (
                <Card key={index} variant="outlined" sx={{ border: "unset", mt: 3, p: 3, display: 'flex', flexDirection: 'column', height: 288 }}>
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: theme.shape.borderRadius / 2,
                            bgcolor: brand.greenLight,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <step.icon color={brand.greenDark} />
                    </Box>
                    <Box sx={{ mt: 'auto' }}>
                        <Typography variant="h3">{step.title}</Typography>
                        <Typography variant="body1" sx={{ pt: 2 }}>{step.description}</Typography>
                    </Box>
                </Card>
            ))}
        </Box>
    );
}

function StoriesSection() {
    const { data, error } = useQuery<LoanProfile[]>({
        queryKey: ['story-profile'],
        queryFn: async () => {
            const response = await fetch('http://localhost:8000/api/loan/profile?type=stories');
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        },
    });

    if (error) return <Box m={4}>Error loading stories: {error.message}</Box>;

    return (
        <Box>
            <Box m={4}>
                <Typography variant="h3">
                    Impact <Typography variant="h3" component="span" sx={{ color: brand.greenDark }}>Stories</Typography>
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Hear from the entrepreneurs that Kind Loans supports.
                </Typography>
            </Box>
            <LandPageCarousel profiles={data} />
        </Box>
    );
}

const LoanListSection = forwardRef<HTMLDivElement>((props, ref) => {
    const [searchOpen, setSearchOpen] = useState(false);

    const { data, error } = useQuery<LoanProfile[]>({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await fetch('http://localhost:8000/api/loan/profile');
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        },
    });

    if (error) return <Box m={4}>Error loading loans: {error.message}</Box>;

    return (
        <Box ref={ref} m={4}>
            <Typography variant="h3">
                <Typography variant="h3" component="span" sx={{ color: brand.greenDark }}>Find</Typography> a Loan to Support
            </Typography>

            <SearchDialog open={searchOpen} handleClose={() => setSearchOpen(false)} />

            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2, mb: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSearchOpen(true)}
                    sx={{ fontSize: 12, fontWeight: 500 }}
                >
                    Filter by Category
                </Button>
                <SortFilterPopover />
            </Box>

            <Box sx={{ mt: 2 }}>
                {data?.map((loan) => (
                    <BorrowerCardWithProgress
                        key={loan.id}
                        imgPath={loan.profile_img}
                        location={`${loan.country}, ${loan.city}`}
                        deadLine={loan.deadline_to_receive_loan}
                        loanTitle={loan.title}
                        remainingBalance={loan.remaining_balance}
                        targetAmount={loan.target_amount}
                    />
                ))}
            </Box>

            <Box textAlign="center" sx={{ mt: 4, mb: 7 }}>
                <Button variant="outlined">+ View More</Button>
            </Box>

            <Box textAlign="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                    * 100% of your loan goes to supporting borrowers.
                    <Typography variant="caption" display="block">
                        Terms of conditions
                    </Typography>
                </Typography>
            </Box>
        </Box>
    );
});
